# Hyderabad Home Tutors: Frontend (React + Vite)

## Run locally
    npm install
    cp .env.example .env     # set VITE_API_URL to your backend, e.g. http://localhost:5000/api
    npm run dev

## Deploy (separate host)
Build command `npm run build`, output dir `dist`.
Set env var `VITE_API_URL` to your deployed backend URL ending in `/api`.
SPA rewrites are included (vercel.json for Vercel, public/_redirects for Netlify).

## API this frontend expects
POST /auth/register {name,email,phone,password,role} -> {token,user}
POST /auth/login {email,password} -> {token,user}
GET  /auth/me -> {user}
GET  /tutors?area&subject&category -> {tutors:[{_id,user:{name,phone},headline,qualification,experienceYears,feePerHour,subjects,categories,areas,modes,bio}]}
GET  /tutors/me -> {profile}   PUT /tutors/me (profile body) -> {profile}
GET  /tuitions?area&subject&category -> {tuitions:[{_id,subjects,category,area,mode,budget,daysPerWeek,description}]}
POST /tuitions (student) ; GET /tuitions/mine -> {items:[tuition + applicants:[{_id,tutor:{name,phone},status}]]}
POST /tuitions/:id/apply (tutor)
GET  /applications/mine (tutor) -> {items:[{_id,status,tuition:{...,student:{name,phone}}}]}
