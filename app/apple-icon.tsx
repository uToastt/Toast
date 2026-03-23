import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 180, height: 180 };

export default async function AppleIcon() {
  const imageData = await fetch(
    "https://yt3.googleusercontent.com/NyVQ_LhL1IT67IE7ljjIcOLqHdKqMgPn5F7GW8SvMgpGRyLkNqFC-dqOWPs0QGMgVvmTsB_G=s176-c-k-c0x00ffffff-no-rj"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "20%",
          overflow: "hidden",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${Buffer.from(imageData).toString("base64")}`}
          width={180}
          height={180}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    { ...size }
  );
}
