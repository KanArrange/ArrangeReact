package com.arrange.react;

import android.content.Intent;
import android.os.Bundle;
import android.os.PersistableBundle;

import com.BV.LinearGradient.LinearGradientPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import cl.json.RNSharePackage;

public class MainActivity extends ReactActivity {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;
    private CallbackManager mCallbackManager;
    private ReactNativePushNotificationPackage _pushNotification;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ArrangeReact";
    }

    @Override
    public void onCreate(Bundle savedInstanceState, PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);
        mCallbackManager = new CallbackManager.Factory().create();
        this._pushNotification = new ReactNativePushNotificationPackage(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new FBSDKPackage(mCallbackManager))
                .addPackage(new LinearGradientPackage())
                .addPackage(new RNSharePackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        mReactRootView.startReactApplication(mReactInstanceManager, "ArrangeReact", null);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }


    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        this._pushNotification.newIntent(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        AppEventsLogger.activateApp(getApplicationContext());
    }

    @Override
    protected void onPause() {
        super.onPause();
        AppEventsLogger.deactivateApp(getApplicationContext());
    }

    @Override
    protected void onStop() {
        super.onStop();
        AppEventsLogger.onContextStop();
    }
}
