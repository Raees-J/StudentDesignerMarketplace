
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Award, Heart, Target, Users } from 'lucide-react';
import React from 'react';

const initialTeam = [
  {
    name: 'Raees',
    role: 'Lead Developer',
    desc: 'Passionate full-stack developer with expertise in modern web technologies. Raees leads the development team in creating innovative solutions for the student designer marketplace.',
    image: '/assets/images/Raees.jpeg',
    sample: '/assets/images/Raees.jpeg',
  },
  {
    name: 'Ethan',
    role: 'Frontend Developer',
    desc: 'Creative frontend developer specializing in React and user interface design. Ethan focuses on delivering exceptional user experiences and responsive web applications.',
    image: '/assets/images/Ethan.jpeg',
    sample: '/assets/images/Ethan.jpeg',
  },
  {
    name: 'Justin',
    role: 'Backend Developer',
    desc: 'Expert backend developer with strong skills in server-side technologies and database management. Justin ensures robust and scalable system architecture.',
    image: '/assets/images/Justin.jpeg',
    sample: '/assets/images/Justin.jpeg',
  },
  {
    name: 'Aristide',
    role: 'Full Stack Developer',
    desc: 'Versatile developer with experience in both frontend and backend development. Aristide contributes to all aspects of the application, ensuring seamless integration between components.',
    image: '/assets/images/Aristide.jpeg',
    sample: '/assets/images/Aristide.jpeg',
  },
  {
    name: 'Anwil',
    role: 'UI/UX Designer',
    desc: 'Creative designer with a keen eye for user experience and interface design. Anwil focuses on creating intuitive and visually appealing designs that enhance the overall user journey.',
    image: '/assets/images/Anwil.jpeg',
    sample: '/assets/images/Anwil.jpeg',
  },
];

const About: React.FC = () => {
  // No upload or URL state needed, just use initialTeam
  const team = initialTeam;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      {/* Hero and Mission Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
            About University Store
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            We are the official merchandise store for the University Marketing Department of CPUT,
            providing high-quality products that represent our institution with pride and excellence.
          </p>
          
          <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
            Our Mission
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            To provide the university community and supporters with premium merchandise
            that reflects our values of excellence, innovation, and tradition.
          </p>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.6 }}>
            From comfortable study furniture to branded apparel and promotional items,
            we ensure every product meets the highest standards of quality and design.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            Our Values
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4" style={{ gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Excellence
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
              We strive for the highest quality in every product and service we provide.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Innovation
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
              We continuously seek new and better ways to serve our community.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#f59e0b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Community
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
              We build connections and foster a sense of belonging within our university.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#8b5cf6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Passion
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
              We are passionate about representing our university and serving our community.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            Our Story
          </h2>
        </div>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Established as part of the university's marketing initiative, our store has been
            serving the campus community for over a decade.
          </p>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            What started as a small merchandise counter has grown into a comprehensive store
            offering everything from academic furniture to branded apparel and event equipment.
          </p>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.6 }}>
            Today, we continue to expand our offerings while maintaining our commitment to
            quality and service that our community has come to expect.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            Meet Our Team
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            The dedicated professionals behind our success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4" style={{ gap: '2rem' }}>
          {team.map((member, idx) => (
            <Card key={member.name} sx={{ p: 2, textAlign: 'center', borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 370 }}>
              <div style={{
                width: '8.5rem',
                height: '8.5rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              }}>
                <img
                  src={member.image ? member.image : member.sample}
                  alt={member.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: member.name === 'Ethan' ? 'contain' : 'cover',
                    objectPosition: member.name === 'Ethan' ? 'center' : 'center top'
                  }}
                  onError={e => { e.currentTarget.src = member.sample; }}
                />
              </div>
              {/* No upload or URL input, just display the image */}
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#1f2937' }}>{member.name}</Typography>
                <Typography sx={{ color: '#3b82f6', fontSize: '0.95rem', mb: 1, fontWeight: 500 }}>{member.role}</Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>{member.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default About

// // Temporary safe placeholder so app won’t break
// import React from 'react'

// const About: React.FC = () => {
//   return <div></div> // or just null
// }

// export default About