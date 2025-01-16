interface EmailData {
  id: string;
  subject: string;
  sender: string;
  preview: string;
  content: string;
  timestamp: string;
}

// Extract email data from Gmail's DOM
export async function getEmails(): Promise<EmailData[]> {
  const emails: EmailData[] = [];
  const emailElements = document.querySelectorAll('[role="row"]');

  emailElements.forEach((element) => {
    // Skip if not an email row
    if (!element.classList.contains('zA')) return;

    try {
      const id = element.getAttribute('data-legacy-thread-id') || '';
      const subject = element.querySelector('[data-thread-id]')?.getAttribute('aria-label') || '';
      const sender = element.querySelector('[email]')?.getAttribute('email') || '';
      const preview = element.querySelector('.y2')?.textContent || '';
      const timestamp = element.querySelector('.xW')?.querySelector('[title]')?.getAttribute('title') || '';
      
      // Get full email content if the email is open
      const content = getEmailContent(element);

      emails.push({
        id,
        subject,
        sender,
        preview,
        content,
        timestamp
      });
    } catch (error) {
      console.error('Error parsing email:', error);
    }
  });

  return emails;
}

// Extract content from an open email
function getEmailContent(element: Element): string {
  try {
    const openEmail = element.querySelector('.a3s.aiL');
    if (openEmail) {
      return openEmail.textContent || '';
    }
  } catch (error) {
    console.error('Error getting email content:', error);
  }
  return '';
}

// Listen for email open events
export function setupEmailOpenListener(callback: (emailData: EmailData) => void) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const emailContainer = document.querySelector('.a3s.aiL');
        if (emailContainer) {
          const emailRow = emailContainer.closest('[role="row"]');
          if (emailRow) {
            const emailData = extractEmailData(emailRow as Element, emailContainer);
            if (emailData) {
              callback(emailData);
            }
          }
        }
      }
    }
  });

  // Observe changes in the email container
  const gmailContent = document.querySelector('[role="main"]');
  if (gmailContent) {
    observer.observe(gmailContent, {
      childList: true,
      subtree: true,
    });
  }
}

// Extract data from a single email
function extractEmailData(row: Element, contentContainer: Element): EmailData | null {
  try {
    const id = row.getAttribute('data-legacy-thread-id') || '';
    const subject = row.querySelector('[data-thread-id]')?.getAttribute('aria-label') || '';
    const sender = row.querySelector('[email]')?.getAttribute('email') || '';
    const preview = row.querySelector('.y2')?.textContent || '';
    const timestamp = row.querySelector('.xW')?.querySelector('[title]')?.getAttribute('title') || '';
    const content = contentContainer.textContent || '';

    return {
      id,
      subject,
      sender,
      preview,
      content,
      timestamp
    };
  } catch (error) {
    console.error('Error extracting email data:', error);
    return null;
  }
}
