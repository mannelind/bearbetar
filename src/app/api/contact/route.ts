import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  phone: z.string().regex(/^[\+]?[0-9\s\-\(\)]{8,15}$/).optional().or(z.literal('')),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  projectType: z.enum(['webbsida', 'app', 'utveckling', 'radgivning', 'annat']),
  budget: z.enum(['under-25k', '25k-50k', '50k-100k', '100k-plus', 'vet-inte']).optional(),
  timeline: z.enum(['akut', '1-manaden', '2-3-manader', 'langre', 'flexibel']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = contactSchema.parse(body)
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send autoresponse email
    // 4. Add to CRM system, etc.
    
    // For now, we'll just log the contact form submission
    console.log('New contact form submission:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })

    // Simulate email sending (you'd replace this with actual email service)
    await simulateEmailSending(validatedData)
    
    return NextResponse.json(
      { 
        message: 'Meddelandet skickades framgångsrikt',
        success: true 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Ogiltig data skickad',
          errors: error.errors,
          success: false 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        message: 'Internt serverfel',
        success: false 
      },
      { status: 500 }
    )
  }
}

// Simulate email sending - replace with actual email service
async function simulateEmailSending(data: any) {
  // This is where you'd integrate with:
  // - Resend, SendGrid, Mailgun, etc. for sending emails
  // - Your email template service
  // - CRM integration
  
  const emailContent = {
    to: 'hej@bearbetar.se', // Your email
    replyTo: data.email,
    subject: `Ny kontaktförfrågan: ${data.subject}`,
    html: `
      <h2>Ny kontaktförfrågan från ${data.name}</h2>
      
      <h3>Kontaktinfo:</h3>
      <ul>
        <li><strong>Namn:</strong> ${data.name}</li>
        <li><strong>E-post:</strong> ${data.email}</li>
        ${data.company ? `<li><strong>Företag:</strong> ${data.company}</li>` : ''}
        ${data.phone ? `<li><strong>Telefon:</strong> ${data.phone}</li>` : ''}
      </ul>
      
      <h3>Projekt:</h3>
      <ul>
        <li><strong>Typ:</strong> ${getProjectTypeLabel(data.projectType)}</li>
        ${data.budget ? `<li><strong>Budget:</strong> ${getBudgetLabel(data.budget)}</li>` : ''}
        ${data.timeline ? `<li><strong>Tidsram:</strong> ${getTimelineLabel(data.timeline)}</li>` : ''}
      </ul>
      
      <h3>Meddelande:</h3>
      <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${data.message.replace(/\n/g, '<br>')}
      </p>
      
      <hr>
      <p style="font-size: 12px; color: #666;">
        Skickat från kontaktformuläret på bearbetar.se
      </p>
    `,
    text: `
      Ny kontaktförfrågan från ${data.name}
      
      E-post: ${data.email}
      ${data.company ? `Företag: ${data.company}` : ''}
      ${data.phone ? `Telefon: ${data.phone}` : ''}
      
      Projekt: ${getProjectTypeLabel(data.projectType)}
      ${data.budget ? `Budget: ${getBudgetLabel(data.budget)}` : ''}
      ${data.timeline ? `Tidsram: ${getTimelineLabel(data.timeline)}` : ''}
      
      Meddelande:
      ${data.message}
    `
  }
  
  // Here you would actually send the email
  // Example with Resend:
  // await resend.emails.send(emailContent)
  
  console.log('Email would be sent:', emailContent)
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000))
}

function getProjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'webbsida': 'Webbsida',
    'app': 'Mobilapp eller webapp',
    'utveckling': 'Skräddarsydd utveckling',
    'radgivning': 'Rådgivning/konsultation',
    'annat': 'Annat'
  }
  return labels[type] || type
}

function getBudgetLabel(budget: string): string {
  const labels: Record<string, string> = {
    'under-25k': 'Under 25 000 kr',
    '25k-50k': '25 000 - 50 000 kr',
    '50k-100k': '50 000 - 100 000 kr',
    '100k-plus': '100 000+ kr',
    'vet-inte': 'Vet inte / Vill diskutera'
  }
  return labels[budget] || budget
}

function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    'akut': 'ASAP / Akut',
    '1-manaden': 'Inom en månad',
    '2-3-manader': '2-3 månader',
    'langre': 'Längre tid',
    'flexibel': 'Flexibel'
  }
  return labels[timeline] || timeline
}