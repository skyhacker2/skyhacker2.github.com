wtk = {

    browser : new (function(navigator) {
        var language = navigator.language || navigator.browserLanguage;
        var userAgent = navigator.userAgent.toLowerCase();
        var version = (userAgent.match(/.*(?:rv|chrome|webkit|opera|ie)[\/: ](.+?)([ \);]|$)/) || [])[1];
        var iOSAgent = (userAgent.match(/\b(iPad|iPhone|iPod)\b.*\bOS/i) || []);
        var iOSDevice = iOSAgent[1];

        this.userAgent = userAgent;

        this.language = language.split('-', 1)[0];

        this.iOSMajorVersion = iOSAgent[2];

        this.iOSMinorVersion = iOSAgent[3];

        this.isIPad = (iOSDevice === 'ipad');

        this.isIPod = (iOSDevice === 'ipod');

        this.isIPhone = (iOSDevice === 'iphone');

        this.isIOS = this.isIPhone || this.isIPod || this.isIPad;

        this.isMobileSafari = !!/apple.*mobile/.test(userAgent) && this.isIOS;

        this.isIPadSafari = this.isIPad && this.isMobileSafari;

        this.isIPodSafari = this.isIPod && this.isMobileSafari;

        this.isIPhoneSafari = this.isIPhone && this.isMobileSafari;

        this.isMac = !!/macintosh/.test(userAgent)
                || (/mac os x/.test(userAgent) && !/like mac os x/.test(userAgent));

        this.isLion = !!(/mac os x 10[_\.][7-9]/.test(userAgent)
                && !/like mac os x 10[_\.][7-9]/.test(userAgent));

        this.isAndroid = !!/android/.test(userAgent);

        this.isLinux = !!/linux/.test(userAgent);

        this.isSilk = !!/silk/.test(userAgent);

        this.isWindows = !!/windows/.test(userAgent);

        this.isChrome = !!/chrome/.test(userAgent);

        this.chromeVersion = (userAgent.match(/chrome\/(.+?) /) || [])[1];

        this.isGecko = !!/firefox|gecko/.test(userAgent);

        this.geckoVersion = (userAgent.match(/(?:firefox|gecko)\/([\d\.]+)/) || [])[1]

        this.isIE = !!/msie \d+\.\d+|trident\/\d+\.\d.+; rv:\d+\.\d+[;\)]/.test(userAgent);

        this.ieVersion = (userAgent.match(/(?:msie|trident)[ \/]([\d\.]+)/) || [])[1];

        this.isOpera = !!/opera/.test(userAgent);

        this.operaVersion = (userAgent.match(/opera\/([\d\.]+)/) || [])[1];

        this.isMozilla = !!/mozilla/.test(userAgent)
                && !/(compatible|webkit|msie|trident)/.test(userAgent);

        this.mozillaVersion = (userAgent.match(/mozilla\/([\d\.]+)/) || [])[1];

        this.isSafari = this.isWebkit
                    && !this.isAndroid
                    && !this.isChrome
                    && !this.isIOS;

        this.isWebkit = !!/webkit/.test(userAgent);

        this.webkitVersion = (userAgent.match(/webkit\/(.+?) /) || [])[1];

        this.isWechat = /micro\s*messenger/.test(userAgent);

        this.os = this.isAndroid ? 'android'
                : this.isLinux   ? 'linux'
                : this.isMac     ? 'mac'
                : this.isWindows ? 'windows'
                : 'other';

        this.name = this.isIE           ? 'msie'
                  : this.isMozilla      ? 'mozilla'
                  : this.isChrome       ? 'chrome'
                  : this.isSafari       ? 'safari'
                  : this.isOpera        ? 'opera'
                  : this.isMobileSafari ? 'mobile-safari'
                  : this.isAndroid      ? 'android'
                  : 'unknown';

    })(navigator),

};
