import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#C8FF00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 14,
            fontWeight: 900,
            color: '#080808',
            letterSpacing: '1px',
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
