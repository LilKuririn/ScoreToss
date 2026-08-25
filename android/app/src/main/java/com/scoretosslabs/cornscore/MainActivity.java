package com.scoretosslabs.cornscore;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewFeature;

/**
 * Coquille native autour de l'application web. Les fichiers sont servis
 * depuis les assets via une origine https, et non en file://, pour que
 * localStorage se comporte normalement — c'est là qu'est stockée la partie
 * en cours, le tournoi et le palmarès.
 */
public class MainActivity extends AppCompatActivity {

    private static final String HOST   = "appassets.androidplatform.net";
    private static final String ORIGIN = "https://" + HOST;

    /**
     * Le bouton retour d'Android s'appuie sur l'interface existante : il ferme
     * ce qui est ouvert, ou remonte d'un écran, sans rien changer à la page.
     */
    private static final String BACK_JS =
        "(function(){" +
        "  var t=document.getElementById('tossWrap');" +
        "  if(t && !t.hidden) return '1';" +
        "  var s=document.getElementById('sheetWrap');" +
        "  if(s && s.classList.contains('on')){ document.getElementById('closeSheet').click(); return '1'; }" +
        "  var b=document.getElementById('bkSheetWrap');" +
        "  if(b && b.classList.contains('on')){ document.getElementById('bkSheetClose').click(); return '1'; }" +
        "  var mk=document.getElementById('mkSheetWrap');" +
        "  if(mk && mk.classList.contains('on')){ document.getElementById('mkSheetClose').click(); return '1'; }" +
        "  var ml=document.getElementById('mkLayoutWrap');" +
        "  if(ml && ml.classList.contains('on')){ document.getElementById('mkLayoutClose').click(); return '1'; }" +
        "  var g=document.getElementById('rulesWrap');" +
        "  if(g && g.classList.contains('on')){ document.getElementById('rulesClose').click(); return '1'; }" +
        "  var a=document.getElementById('aboutWrap');" +
        "  if(a && a.classList.contains('on')){ document.getElementById('aboutClose').click(); return '1'; }" +
        "  function on(id){ var e=document.getElementById(id); return e && e.classList.contains('on'); }" +
        "  if(on('s-hall')){ document.getElementById('hallBack').click(); return '1'; }" +
        "  if(on('s-tsetup')){ document.getElementById('tsBack').click(); return '1'; }" +
        "  if(on('s-bracket')){ document.getElementById('bkHome').click(); return '1'; }" +
        "  if(on('s-msetup')){ document.getElementById('mkToGames').click(); return '1'; }" +
        "  if(on('s-setup')){ document.getElementById('backToGames').click(); return '1'; }" +
        "  return '0';" +
        "})()";

    private WebView web;
    private long lastBack = 0L;

    private ValueCallback<Uri[]> pendingFile;
    private final ActivityResultLauncher<String> picker =
        registerForActivityResult(new ActivityResultContracts.GetContent(), new ActivityResultCallback<Uri>() {
            @Override
            public void onActivityResult(Uri uri) {
                if (pendingFile == null) return;
                pendingFile.onReceiveValue(uri == null ? null : new Uri[]{uri});
                pendingFile = null;
            }
        });

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web = new WebView(this);
        web.setOverScrollMode(WebView.OVER_SCROLL_NEVER);

        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);

        /* Laisse la page choisir son thème clair ou sombre selon celui du système. */
        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
            WebSettingsCompat.setAlgorithmicDarkeningAllowed(settings, true);
        }

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            /* Tout ce qui sort des assets part au navigateur : sans cela un lien
               externe se chargerait dans la WebView, hors de son origine, et
               l'application n'aurait plus aucun moyen de revenir. */
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri != null && HOST.equals(uri.getHost())) return false;
                openExternally(uri);
                return true;
            }
        });

        web.addJavascriptInterface(new Bridge(this), "Cornscore");

        /* Le champ de fichier de la page ne s'ouvre pas tout seul dans une
           WebView : c'est à l'activité de présenter le sélecteur. */
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view,
                                             ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (pendingFile != null) pendingFile.onReceiveValue(null);
                pendingFile = callback;
                try {
                    picker.launch("application/json");
                } catch (Exception e) {
                    pendingFile = null;
                    return false;
                }
                return true;
            }
        });

        setContentView(web);

        /* Le bord à bord est imposé, et l'exemption du thème n'est plus
           honorée à partir de l'API 36 : cette marge est désormais la seule
           chose qui empêche la page de passer sous les barres système.
           Elle s'applique à la racine du contenu — et non à la WebView avant
           son rattachement, où l'écouteur n'était jamais appelé — puis on
           réclame explicitement une distribution des marges. */
        final View root = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(root, new OnApplyWindowInsetsListener() {
            @Override
            public WindowInsetsCompat onApplyWindowInsets(View v, WindowInsetsCompat insets) {
                Insets bars = insets.getInsets(
                        WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
                v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return WindowInsetsCompat.CONSUMED;
            }
        });
        ViewCompat.requestApplyInsets(root);

        installBackHandler();
        web.loadUrl(ORIGIN + "/assets/index.html");
    }

    private void openExternally(Uri uri) {
        if (uri == null) return;
        String scheme = uri.getScheme();
        if (!"http".equals(scheme) && !"https".equals(scheme)) return;
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, R.string.no_browser, Toast.LENGTH_SHORT).show();
        }
    }

    /* Le retour passe par le répartiteur d'AndroidX plutôt que par
       onBackPressed(), que le système n'appelle plus pour une application
       visant l'API 36 — le geste y est régi par le retour prédictif. */
    private void installBackHandler() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                web.evaluateJavascript(BACK_JS, new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if (value != null && value.contains("1")) return;
                        long now = System.currentTimeMillis();
                        if (now - lastBack < 2000L) {
                            finish();
                        } else {
                            lastBack = now;
                            Toast.makeText(MainActivity.this, R.string.quit_hint, Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });
    }
}
