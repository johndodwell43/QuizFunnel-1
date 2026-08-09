import React from 'react';
import { LINKS } from '../config.js';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 34,
        paddingTop: 22,
        borderTop: '1px solid rgba(17,24,39,0.12)',
        color: '#6b7381',
        fontSize: 13,
        lineHeight: 1.5,
        textAlign: 'center'
      }}
    >
      <p style={{ margin: '0 0 6px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#454e5c' }}>
        COSMETIC APPLIANCE DISCLOSURE
      </p>
      <p style={{ margin: '0 auto', maxWidth: 640 }}>
        Cosmetic removable appliances are non-surgical, non-permanent dental devices intended for
        aesthetic enhancement only. They do not move teeth, correct bite alignment, or treat dental
        disease. All cases are reviewed by a licensed dentist prior to fabrication where applicable.
        Eligibility is determined at the discretion of the reviewing provider. Results vary by
        individual case. Appliances are removable and not intended as a substitute for comprehensive
        dental care. Patients should maintain regular in-office dental examinations and follow the
        advice of their local dental provider.
      </p>
      <p style={{ margin: '14px auto 0 auto', maxWidth: 640 }}>
        All clinical reviews are performed by independently contracted state-licensed dental
        professionals. Klyros does not practice dentistry.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 18px', margin: '16px 0' }}>
        <a href={LINKS.refund} style={{ color: '#2F5BEA' }}>Refund Policy</a>
        <a href={LINKS.fitAssurance} style={{ color: '#2F5BEA' }}>Fit Assurance™</a>
        <a href={LINKS.privacy} style={{ color: '#2F5BEA' }}>Privacy Policy</a>
      </div>

      <p style={{ margin: 0 }}>© 2026 Klyros Dental, Inc. All rights reserved.</p>
      <p style={{ margin: '6px 0 0 0' }}>
        3130 E Thousand Oaks Blvd, Unit 101 PMB 1054, Thousand Oaks, CA 91362
      </p>
      <p style={{ margin: '6px 0 0 0' }}>
        <a href={`mailto:${LINKS.email}`} style={{ color: '#2F5BEA' }}>{LINKS.email}</a>
      </p>
    </footer>
  );
}
