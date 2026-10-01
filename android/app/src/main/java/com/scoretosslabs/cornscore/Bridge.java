package com.scoretosslabs.cornscore;

import android.content.Intent;
import android.webkit.JavascriptInterface;

/**
 * Le peu que la page ne peut pas faire seule dans une WebView : enregistrer
 * un fichier, et ouvrir le partage du téléphone. Seules les pages servies
 * depuis les assets sont chargées, ce pont n'est donc jamais exposé à du
 * contenu extérieur.
 */
public class Bridge {

    private final MainActivity activity;

    Bridge(MainActivity activity) {
        this.activity = activity;
    }

    /* L'utilisateur choisit où enregistrer, par le sélecteur du système :
       aucune permission de stockage, quelle que soit la version d'Android. */
    @JavascriptInterface
    public void saveFile(final String name, final String content) {
        activity.runOnUiThread(new Runnable() {
            @Override public void run() { activity.enregistrer(name, content); }
        });
    }

    @JavascriptInterface
    public void share(final String text) {
        activity.runOnUiThread(new Runnable() {
            @Override public void run() {
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType("text/plain");
                send.putExtra(Intent.EXTRA_TEXT, text);
                activity.startActivity(Intent.createChooser(send, activity.getString(R.string.share_via)));
            }
        });
    }
}
