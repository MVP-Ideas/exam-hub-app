import {
  PublicClientApplication,
  Configuration,
  LogLevel,
} from "@azure/msal-browser";

export const b2cPolicies = {
  names: {
    signUpSignIn: "b2c_1_susi",
    forgotPassword: "b2c_1_reset",
    editProfile: "b2c_1_edit_profile",
  },
  authorities: {
    signUpSignIn: {
      authority: `${process.env.NEXT_PUBLIC_B2C_BASE_AUTHORITY}/b2c_1_susi`,
    },
    forgotPassword: {
      authority: `${process.env.NEXT_PUBLIC_B2C_BASE_AUTHORITY}/b2c_1_reset`,
    },
    editProfile: {
      authority: `${process.env.NEXT_PUBLIC_B2C_BASE_AUTHORITY}/b2c_1_edit_profile`,
    },
  },
  authorityDomain: process.env.NEXT_PUBLIC_B2C_AUTHORITY_DOMAIN!,
};

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_B2C_CLIENT_ID!,
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    redirectUri: process.env.NEXT_PUBLIC_B2C_REDIRECT_URI,
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_B2C_LOGOUT_REDIRECT_URI,
    knownAuthorities: [b2cPolicies.authorityDomain],
  },
  cache: {
    cacheLocation: "sessionStorage",
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

export const scopeApi = `${process.env.NEXT_PUBLIC_B2C_SCOPE_BASE}/userprofile.read`;

export const loginScopes = ["openid", "profile", "email", scopeApi];

let _msalInstance: PublicClientApplication | null = null;

export const getMsalInstance = async (): Promise<PublicClientApplication> => {
  if (!_msalInstance) {
    _msalInstance = new PublicClientApplication(msalConfig);
    await _msalInstance.initialize();
  }
  return _msalInstance;
};
