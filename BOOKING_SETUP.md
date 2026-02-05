# Booking Calendar Setup

The Work Together page uses **Calendly** to let visitors book discovery calls. Calendly syncs automatically with your Google Calendar.

## Setup Steps

1. **Create a Calendly account** (free): [calendly.com](https://calendly.com)

2. **Connect Google Calendar**:
   - In Calendly, go to **Integrations** → **Google Calendar**
   - Connect your Google account and grant access
   - Calendly will sync availability and add bookings to your calendar

3. **Create an event type**:
   - In Calendly, create a new event (e.g. "Discovery Call" or "30-Minute Call")
   - Set your availability and duration

4. **Update the embed URL** in `work-together.html`:
   - In Calendly, go to your event and copy the **Share** link (e.g. `https://calendly.com/yourname/discovery-call`)
   - Open `work-together.html` and find the iframe around line 55
   - Replace `your-calendly-username/discovery-call` in the `src` attribute with your Calendly event path
   - Example: If your link is `https://calendly.com/maria/discovery-call`, use `src="https://calendly.com/maria/discovery-call?hide_gdpr_banner=1"`
