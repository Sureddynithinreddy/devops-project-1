# CloudDesk - Service Management Platform

A modern, full-stack ticket management system built with React, Node.js/Express, and MongoDB. CloudDesk enables teams to efficiently manage support tickets with real-time status tracking and multi-user support.

## Features

### 👥 Multi-User System
- **Customer Registration & Login** - Users can create accounts and authenticate securely
- **Customer Portal** - Create tickets, view ticket history, track status updates in real-time
- **Admin Dashboard** - Manage all tickets, update status, view analytics

### 🎫 Ticket Management
- **Create Tickets** - Customers submit support requests with title, description, and category
- **Status Tracking** - Tickets progress through: Open → In Progress → Resolved → Closed
- **Real-Time Updates** - Customer dashboards auto-refresh every 5 seconds to show latest status
- **Categorization** - Organize tickets by type (Technical, Billing, General, Feature Request)

### 📊 Analytics & Dashboard
- **Admin Dashboard** - View all tickets, stats, and analytics
- **Real-time Statistics** - Total tickets, open tickets, resolved count, active users
- **Charts & Graphs** - Visualize ticket trends and status distribution
- **Ticket Table** - Manage and update ticket statuses with one click

### 🔐 Security
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcryptjs for secure password storage
- **Role-Based Access Control** - Separate customer and admin roles
- **Protected Routes** - API endpoints secured with middleware

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin support

### Database
- **MongoDB Atlas** - Cloud database

## Project Structure

```
clouddesk/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (Login, Dashboard, etc.)
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── dist/                # Production build
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js/Express application
│   ├── config/              # Configuration files
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── scripts/             # Utility scripts
│   ├── server.js            # Main server file
│   └── package.json
│
├── .env                     # Environment variables
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/clouddesk.git
cd clouddesk
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clouddesk?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Server Configuration
SERVER_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

5. **Create Admin User** (Optional)
```bash
cd backend
node scripts/createAdmin.js
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Production Build

**Build Frontend**
```bash
cd frontend
npm run build
```

**Run Backend**
```bash
cd backend
npm start
```

## Usage

### Customer Workflow

1. **Register**
   - Go to http://localhost:5173/register
   - Create account with email and password

2. **Login**
   - Go to http://localhost:5173/login
   - Enter credentials

3. **Create Ticket**
   - Click "Create Ticket" button
   - Fill title, description, category
   - Submit

4. **Track Status**
   - View tickets in dashboard
   - Status updates automatically (every 5 seconds)
   - See real-time changes as admin updates

### Admin Workflow

1. **Login as Admin**
   ```
   Email: admin@example.com
   Password: admin123
   ```

2. **View All Tickets**
   - Admin dashboard shows all tickets from all customers

3. **Update Ticket Status**
   - Click "Edit" on any ticket
   - Select new status from dropdown
   - Click "Save"

4. **Monitor Analytics**
   - View statistics and charts
   - Track ticket trends

## API Endpoints

### Authentication
```
POST   /auth/register        - Register new user
POST   /auth/login           - Login user
POST   /auth/logout          - Logout user
```

### Tickets
```
GET    /tickets              - Get all tickets (admin only)
GET    /tickets/my-tickets   - Get user's tickets
GET    /tickets/:id          - Get ticket details
POST   /tickets              - Create new ticket
PUT    /tickets/:id          - Update ticket
PUT    /tickets/:id/status   - Update ticket status (admin only)
DELETE /tickets/:id          - Delete ticket
```

### Admin
```
GET    /admin/stats          - Get system statistics
GET    /admin/users          - Get all users (admin only)
```

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer/admin),
  created_at: Date,
  updated_at: Date
}
```

### Tickets Collection
```javascript
{
  user_id: ObjectId (reference to Users),
  title: String,
  description: String,
  category: String,
  status: String (open/in-progress/resolved/closed),
  priority: String,
  assigned_to: ObjectId,
  created_at: Date,
  updated_at: Date
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development / production |
| `PORT` | Backend server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb+srv://... |
| `JWT_SECRET` | Secret for JWT signing | any_secret_key |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `SERVER_URL` | Backend URL | http://localhost:5000 |
| `FRONTEND_URL` | Frontend URL | http://localhost:5173 |

## Development

### Running Tests
```bash
cd backend
npm test
```

### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint

# Backend linting
cd backend
npm run lint
```

## Deployment

### Heroku Deployment
```bash
# Create Heroku app
heroku create clouddesk-app

# Set environment variables
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Docker Deployment
```bash
# Build Docker image
docker build -t clouddesk .

# Run container
docker run -p 5000:5000 -e MONGODB_URI=your_uri clouddesk
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@clouddesk.com or open an issue on GitHub.

## Roadmap

- [ ] Email notifications for ticket updates
- [ ] Ticket comments and collaboration
- [ ] File attachments
- [ ] Advanced search and filtering
- [ ] Customer satisfaction ratings
- [ ] Mobile app
- [ ] API documentation with Swagger
- [ ] Automated ticket assignment

## Changelog

### v1.0.0 (Initial Release)
- User registration and authentication
- Ticket creation and management
- Admin dashboard
- Real-time status updates
- Analytics and charts

## Authors

- **Your Name** - Initial work

---

**Happy coding! 🚀**
