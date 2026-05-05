import { SAML } from "@node-saml/node-saml";

// Fungsi untuk membersihkan sertifikat dari karakter aneh/spasi
const cleanCert = (cert: string | undefined) => {
  if (!cert) return "";
  return cert.replace(/\s/g, "")
             .replace(/-----BEGINCERTIFICATE-----/g, "")
             .replace(/-----ENDCERTIFICATE-----/g, "");
};

const samlConfig = {
  entryPoint: process.env.SAML_IDP_ENTRY_POINT || "http://10.66.60.63:8080/realms/PustakaONE/protocol/saml",
  issuer: process.env.SAML_ISSUER || "pustakaone-saml",
  callbackUrl: process.env.SAML_CALLBACK_URL || "http://localhost:3000/api/auth/saml/callback",
  // Kita bungkus sertifikat dengan format PEM yang sangat rapi
  idpCert: `-----BEGIN CERTIFICATE-----\n${cleanCert(process.env.SAML_IDP_CERT)}\n-----END CERTIFICATE-----`,
  wantAssertionsSigned: false, // Dimatikan karena Sign Assertions di Keycloak default-nya OFF
  wantAuthnRequestsSigned: false,
};

export const saml = new SAML(samlConfig);
