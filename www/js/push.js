var PushNotifications = (function () {
    function PushNotifications(push) {
        this.pushNotification = push;
        this.setup();
    }
    PushNotifications.prototype.setup = function () {
        if (device.platform == 'android' || device.platform == 'Android') {
            console.log(device);
            this.pushNotification.register(this.successHandler, this.errorHandler, {
                "senderID": "750800674534",
                "ecb": this.onNotificationGcm
            });
        } else {
            this.pushNotification.register(this.tokenHandler, this.errorHandler, {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "onNotificationApn"
            });
        }
    };

    PushNotifications.prototype.successHandler = function (result) {
        console.log(result);
        alert('result = ' + result);
    };

    PushNotifications.prototype.errorHandler = function (error) {
        alert('error = ' + error);
    };

    PushNotifications.prototype.tokenHandler = function (result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
        alert('device token = ' + result);
    };

    // iOS
    PushNotifications.prototype.onNotificationApn = function (event) {
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }

        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }

        if (event.badge) {
            this.pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
        }
    };

    // Android
    PushNotifications.prototype.onNotificationGcm = function (e) {
        alert('onNotificationGcm regID = ' + e.regid)

        $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");

                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    console.log("regID = " + e.regid);
                }
                break;

            case 'message':
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                if (e.foreground) {
                    $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                    // if the notification contains a soundname, play it.
                    var my_media = new Media("/android_asset/www/" + e.soundname);
                    my_media.play();
                } else {
                    if (e.coldstart) {
                        $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    } else {
                        $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    }
                }

                $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                break;

            case 'error':
                $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                break;

            default:
                $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                break;
        }
    };
    return PushNotifications;
})();
