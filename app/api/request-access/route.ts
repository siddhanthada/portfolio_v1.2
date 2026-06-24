import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, name, page } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'hello@siddhant.design',
      to: 'hadasiddhant@gmail.com',
      replyTo: email,
      subject: `Portfolio Access Request — ${page}`,
      text: [
        `Someone requested access to your case study.`,
        ``,
        `Name:  ${name || 'Not provided'}`,
        `Email: ${email}`,
        `Page:  ${page}`,
        ``,
        `Reply directly to this email to send them the password.`,
      ].join('\n'),
    })

    if (error) {
      console.error('[request-access] Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[request-access] sent:', data?.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[request-access] exception:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
