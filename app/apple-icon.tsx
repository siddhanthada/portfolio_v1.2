import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#C8FF00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 72,
            fontWeight: 700,
            color: '#080808',
            letterSpacing: '-2px',
            lineHeight: 1,
          }}
        >
          SH.
        </span>
      </div>
    ),
    { ...size }
  )
}
