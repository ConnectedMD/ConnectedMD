module ConnectedMD.Core.Actions {

    export const Cordova = 'Cordova';

    export enum CordovaActionType{
        Pause,

        Resume,
        // Don't forget to add the org.apache.cordova.network-information plugin in order to have this event working.
        Online,
        // Don't forget to add the org.apache.cordova.network-information plugin in order to have this event working.
        Offline,
        // Don't forget to add the org.apache.cordova.battery-status plugin in order to have this event working.
        BatteryCritical
    }
}