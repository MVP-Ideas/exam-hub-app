import {
	PublicClientApplication,
	Configuration,
	LogLevel,
} from '@azure/msal-browser';

export const b2cPolicies = {
	names: {
		signUpSignIn: 'b2c_1_susi',
		forgotPassword: 'b2c_1_reset',
		editProfile: 'b2c_1_edit_profile',
	},
	authorities: {
		signUpSignIn: {
			authority:
				'https://LevelUpYourDataExamHubDev.b2clogin.com/LevelUpYourDataExamHubDev.onmicrosoft.com/b2c_1_susi',
		},
		forgotPassword: {
			authority:
				'https://LevelUpYourDataExamHubDev.b2clogin.com/LevelUpYourDataExamHubDev.onmicrosoft.com/b2c_1_reset',
		},
		editProfile: {
			authority:
				'https://LevelUpYourDataExamHubDev.b2clogin.com/LevelUpYourDataExamHubDev.onmicrosoft.com/b2c_1_edit_profile',
		},
	},
	authorityDomain: 'LevelUpYourDataExamHubDev.b2clogin.com',
};

export const msalConfig: Configuration = {
	auth: {
		clientId: '92826569-1414-4e93-90fc-6b2010c0a5d8',
		authority: b2cPolicies.authorities.signUpSignIn.authority,
		redirectUri: 'http://localhost:3000',
		postLogoutRedirectUri: 'http://localhost:3000',
		knownAuthorities: [b2cPolicies.authorityDomain],
	},
	cache: {
		cacheLocation: 'sessionStorage',
		storeAuthStateInCookie: false,
	},
	system: {
		loggerOptions: {
			loggerCallback: (level, message, containsPii) => {
				if (containsPii) return;
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						break;
					case LogLevel.Info:
						console.info(message);
						break;
					case LogLevel.Verbose:
						console.debug(message);
						break;
					case LogLevel.Warning:
						console.warn(message);
						break;
				}
			},
		},
	},
};

export const scopeApi =
	'https://LevelUpYourDataExamHubDev.onmicrosoft.com/examhub-api/userprofile.read';

export const loginScopes = ['openid', 'profile', 'email', scopeApi];

let _msalInstance: PublicClientApplication | null = null;

export const getMsalInstance = async (): Promise<PublicClientApplication> => {
	if (!_msalInstance) {
		_msalInstance = new PublicClientApplication(msalConfig);
		await _msalInstance.initialize();
	}
	return _msalInstance;
};
