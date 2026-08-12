// import { betterAuth } from "better-auth";
// import { genericOAuth, keycloak } from "better-auth/plugins"

// export const auth = betterAuth({
//   baseUrl: process.env.BETTER_AUTH_URL!,
//   secret: process.env.BETTER_AUTH_SECRET!,
//   logger: {
//     disabled: false,
//     level: "debug",
//   },

//   plugins: [
//     genericOAuth({
//       config: [
//         keycloak({
//           clientId: process.env.KEYCLOAK_CLIENT_ID!,
//           clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
//           issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER!,
//           redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/oauth2/callback/keycloak`,
//           scopes: ["openid", "profile", "email", "roles"],
//           pkce: true,
//           mapProfile: async (profile:any) => {
//             return {
//               id: profile.sub,
//               email: profile.email,
//               name: profile.name,
//               role: profile.realm_access?.roles?.includes("ADMIN") ? "admin" : "user",
//             };
//           },
//         }),
//       ] ,
//     }) ,
//   ],
//   account: {
//     storeStateStrategy: "cookie",
//   },
// });

import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  baseUrl: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID!,
          clientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!,
          issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER!,

          redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/keycloak`,
          authorizationUrl: `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
          tokenUrl: `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
          userInfoUrl: `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
          scopes: ["openid", "profile", "email", "roles"],
          pkce: true,

          mapProfileToUser: async (profile: any) => {
            return {
              id: profile.sub,
              email: profile.email,
              name: profile.name,
              role: profile.realm_access?.roles?.includes("ADMIN")
                ? "admin"
                : "user",
            };
          },
        },
      ],
    }),
  ],
});
