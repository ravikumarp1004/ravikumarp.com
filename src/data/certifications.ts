import awsCloudPractitioner from "@/assets/badges/aws-cloud-practitioner.png";
import opentextExstreamCloudNative from "@/assets/badges/opentext-exstream-cloud-native.png";
import opentextExstreamDesignProd from "@/assets/badges/opentext-exstream-design-prod.png";
import opentextCloudAiFundamentals from "@/assets/badges/opentext-cloud-ai-fundamentals.png";

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  badgeImage: string;
  credlyUrl: string;
  certificateFile?: string;
}

export const certifications: Certification[] = [
  {
    title: "OpenText Certified Analyst, Exstream Cloud-Native",
    issuer: "OpenText",
    date: "Apr 2026 to Apr 2029",
    credentialId: "fbf3231f-c43d-4ff4-a8cd-4b905e7322f2",
    badgeImage: opentextExstreamCloudNative,
    credlyUrl: "https://www.credly.com/badges/fbf3231f-c43d-4ff4-a8cd-4b905e7322f2/public_url",
    certificateFile: "/documents/OpenText-Certified-Analyst-Exstream-Cloud-Native.pdf",
  },
  {
    title: "OpenText Certified Analyst - Exstream Design and Production",
    issuer: "OpenText",
    date: "Jul 2022 to Feb 2028",
    credentialId: "76a11c8b-8cd6-444f-8e89-6f6f03b61574",
    badgeImage: opentextExstreamDesignProd,
    credlyUrl: "https://www.credly.com/badges/76a11c8b-8cd6-444f-8e89-6f6f03b61574/public_url",
    certificateFile: "/documents/OpenText-Certified-Analyst-Exstream-Design-and-Production.pdf",
  },
  {
    title: "OpenText Cloud + AI Fundamentals (CSS Cloud + AI Academy)",
    issuer: "OpenText",
    date: "Jul 2025 to Jul 2035",
    credentialId: "5867ab62-0c0a-43d7-9b01-715525f97963",
    badgeImage: opentextCloudAiFundamentals,
    credlyUrl: "https://www.credly.com/badges/5867ab62-0c0a-43d7-9b01-715525f97963/public_url",
  },
  {
    title: "AWS Certified Cloud Practitioner (CLF-C02)",
    issuer: "Amazon Web Services",
    date: "Jul 2025 to Jul 2028",
    credentialId: "1921b8bf-8220-48b8-a38f-6b125ab10951",
    badgeImage: awsCloudPractitioner,
    credlyUrl: "https://www.credly.com/badges/1921b8bf-8220-48b8-a38f-6b125ab10951/public_url",
  },
];
