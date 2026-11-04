import React from 'react';
import { LINKS } from '../config.js';

const policyLink = {
  color: '#2F5BEA',
  fontSize: 18,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 48,
  padding: '0 8px',
  textDecoration: 'none'
};

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 34,
        paddingTop: 22,
        borderTop: '1px solid rgba(17,24,39,0.12)',
        color: '#454e5c',
        fontSize: 18,
        lineHeight: 1.5,
        textAlign: 'center'
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 700, letterSpacing: '0.06em', color: '#111827' }}>
        COSMETIC APPLIANCE DISCLOSURE
      </p>
      <p style={{ margin: '0 auto', maxWidth: 640, fontSize: 18, lineHeight: 1.5 }}>
        Cosmetic removable appliances are non-surgical, non-permanent dental devices intended for
        aesthetic enhancement only. They do not move teeth, correct bite alignment, or treat dental
        disease. All cases are reviewed by a licensed dentist prior to fabrication where applicable.
        Eligibility is determined at the discretion of the reviewing provider. Results vary by
        individual case. Appliances are removable and not intended as a substitute for comprehensive
        dental care. Patients should maintain regular in-office dental examinations and follow the
        advice of their local dental provider.
      </p>
      <p style={{ margin: '14px auto 0 auto', maxWidth: 640, fontSize: 18, lineHeight: 1.5 }}>
        All clinical reviews are performed by independently contracted state-licensed dental
        professionals. Klyros does not practice dentistry.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 12px', margin: '16px 0' }}>
        <a href={LINKS.refund} style={policyLink}>Refund Policy</a>
        <a href={LINKS.privacy} style={policyLink}>Privacy Policy</a>
      </div>

      <p style={{ margin: 0, fontSize: 18 }}>© 2026 Klyros Dental, Inc. All rights reserved.</p>
      <p style={{ margin: '6px 0 0 0', fontSize: 18 }}>
        3130 E Thousand Oaks Blvd, Unit 101 PMB 1054, Thousand Oaks, CA 91362
      </p>
      <p style={{ margin: '6px 0 0 0' }}>
        <a href={`mailto:${LINKS.email}`} style={policyLink}>{LINKS.email}</a>
      </p>
    </footer>
  );
}
