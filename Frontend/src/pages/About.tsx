
// import React from 'react'
// import { Users, Award, Target, Heart } from 'lucide-react'

// const About: React.FC = () => {
//   return (
//     <div className="container" style={{ padding: '2rem 0' }}>
//       {/* Hero Section */}
//       <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
//         <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
//           About University Store
//         </h1>
//         <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
//           We are the official merchandise store for the University Marketing Department of CPUT,
//           providing high-quality products that represent our institution with pride and excellence.
//         </p>
//       </section>

//       {/* Mission Section */}
//       <section style={{ marginBottom: '4rem' }}>
//         <div className="grid lg:grid-cols-2" style={{ gap: '3rem', alignItems: 'center' }}>
//           <div>
//             <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
//               Our Mission
//             </h2>
//             <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
//               To provide the university community and supporters with premium merchandise
//               that reflects our values of excellence, innovation, and tradition.
//             </p>
//             <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.6 }}>
//               From comfortable study furniture to branded apparel and promotional items,
//               we ensure every product meets the highest standards of quality and design.
//             </p>
//           </div>
//           <div style={{ textAlign: 'center' }}>
//             <img
//               src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg"
//               alt="University Campus"
//               style={{
//                 width: '100%',
//                 maxWidth: '500px',
//                 borderRadius: '1rem',
//                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
//               }}
//             />
//           </div>
//         </div>
//       </section>

//       {/* Values Section */}
//       <section style={{ marginBottom: '4rem' }}>
//         <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
//           <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
//             Our Values
//           </h2>
//           <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
//             The principles that guide everything we do
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4" style={{ gap: '2rem' }}>
//           <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
//             <div style={{
//               width: '4rem',
//               height: '4rem',
//               backgroundColor: '#3b82f6',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto 1rem',
//               color: 'white'
//             }}>
//               <Award size={24} />
//             </div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
//               Excellence
//             </h3>
//             <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
//               We strive for the highest quality in every product and service we provide.
//             </p>
//           </div>

//           <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
//             <div style={{
//               width: '4rem',
//               height: '4rem',
//               backgroundColor: '#10b981',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto 1rem',
//               color: 'white'
//             }}>
//               <Target size={24} />
//             </div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
//               Innovation
//             </h3>
//             <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
//               We continuously seek new and better ways to serve our community.
//             </p>
//           </div>

//           <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
//             <div style={{
//               width: '4rem',
//               height: '4rem',
//               backgroundColor: '#f59e0b',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto 1rem',
//               color: 'white'
//             }}>
//               <Users size={24} />
//             </div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
//               Community
//             </h3>
//             <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
//               We build connections and foster a sense of belonging within our university.
//             </p>
//           </div>

//           <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
//             <div style={{
//               width: '4rem',
//               height: '4rem',
//               backgroundColor: '#8b5cf6',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto 1rem',
//               color: 'white'
//             }}>
//               <Heart size={24} />
//             </div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
//               Passion
//             </h3>
//             <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
//               We are passionate about representing our university and serving our community.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* History Section */}
//       <section style={{ marginBottom: '4rem' }}>
//         <div className="grid lg:grid-cols-2" style={{ gap: '3rem', alignItems: 'center' }}>
//           <div style={{ textAlign: 'center' }}>
//             <img
//               src="https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg"
//               alt="University History"
//               style={{
//                 width: '100%',
//                 maxWidth: '500px',
//                 borderRadius: '1rem',
//                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
//               }}
//             />
//           </div>
//           <div>
//             <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
//               Our Story
//             </h2>
//             <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
//               Established as part of the university's marketing initiative, our store has been
//               serving the campus community for over a decade.
//             </p>
//             <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
//               What started as a small merchandise counter has grown into a comprehensive store
//               offering everything from academic furniture to branded apparel and event equipment.
//             </p>
//             <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.6 }}>
//               Today, we continue to expand our offerings while maintaining our commitment to
//               quality and service that our community has come to expect.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section>
//         <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
//           <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
//             Meet Our Team
//           </h2>
//           <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
//             The dedicated professionals behind our success
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3" style={{ gap: '2rem' }}>
//           <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
//             <div style={{
//               width: '5rem',
//               height: '5rem',
//               backgroundColor: '#e5e7eb',
//               borderRadius: '50%',
//               margin: '0 auto 1rem',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '2rem',
//               color: '#6b7280'
//             }}>
//               👤
//             </div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
//               Sarah Johnson
//             </h3>
//             <p style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
//               Store Manager
//             </p>
//             <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5 }}>
//               With over 8 years of experience in retail management, Sarah ensures our store
//               operates smoothly and efficiently.
//             </p>
//           </div>

//           <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
//             <div style={{
//               width: '5rem',
//               height: '5rem',
//               backgroundColor: '#e5e7eb',
//               borderRadius: '50%',
//               margin: '0 auto 1rem',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '2rem',
//               color: '#6b7280'
//             }}>
//               👤
//             </div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
//               Michael Chen
//             </h3>
//             <p style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
//               Marketing Coordinator
//             </p>
//             <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5 }}>
//               Michael handles our promotional campaigns and ensures our products align
//               with the university's brand guidelines.
//             </p>
//           </div>

//           <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
//             <div style={{
//               width: '5rem',
//               height: '5rem',
//               backgroundColor: '#e5e7eb',
//               borderRadius: '50%',
//               margin: '0 auto 1rem',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '2rem',
//               color: '#6b7280'
//             }}>
//               👤
//             </div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
//               Emily Rodriguez
//             </h3>
//             <p style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
//               Customer Service Lead
//             </p>
//             <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5 }}>
//               Emily leads our customer service team, ensuring every customer has a
//               positive experience with our store.
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default About

// Temporary safe placeholder so app won’t break
import React from 'react'

const About: React.FC = () => {
  return <div></div> // or just null
}

export default About