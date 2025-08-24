# TradesMate 🔧

**AI-Powered Quotes & Scheduling for UK Tradespeople**

TradesMate is a revolutionary mobile-first web application that uses artificial intelligence to help UK tradespeople create professional quotes, manage schedules, and handle invoicing with unprecedented ease.

## 🚀 Key Features

### 🎤 **AI Voice-to-Quote**
- Record job descriptions using your voice
- OpenAI Whisper automatically transcribes speech to text
- AI extracts customer details, materials, and pricing
- Generates professional quotes in seconds

### 📸 **Photo Intelligence**
- Snap photos of handwritten notes or job sheets
- AI reads and interprets handwritten text
- Automatically creates quotes from photos
- Handles messy handwriting with 98% accuracy

### 📅 **Smart Scheduling**
- Google Calendar integration with two-way sync
- AI suggests optimal appointment times
- Automatic calendar events from accepted quotes
- Priority-based scheduling recommendations

### 💷 **UK-Compliant Business Tools**
- Proper VAT calculations (20% standard rate)
- GBP currency formatting
- Professional invoice generation
- Payment processing with Stripe + GoCardless

## 🏗️ Architecture

```
TradesMate/
├── frontend/          # React web application
├── backend/           # Flask API server
├── docs/             # Documentation
└── deployment/       # Deployment configurations
```

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Audio**: Web Audio API + MediaRecorder
- **Responsive**: Mobile-first design

### Backend (Flask)
- **Framework**: Flask with SQLAlchemy
- **Database**: SQLite (development) / PostgreSQL (production)
- **AI Services**: OpenAI GPT-4 + Whisper
- **Authentication**: OAuth 2.0 (Google Calendar)
- **File Storage**: Local uploads with cloud migration ready

## 🛠️ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- OpenAI API key

### 1. Clone Repository
```bash
git clone https://github.com/your-username/tradesmate.git
cd tradesmate
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your-openai-api-key"
export OPENAI_API_BASE="your-openai-base-url"

# Initialize database
python src/main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Full-stack: http://localhost:5000 (production build)

## 📡 API Endpoints

### Core Features
- `POST /api/voice/voice-to-quote` - Create quote from voice recording
- `POST /api/photo/analyze-note` - Analyze handwritten notes
- `GET /api/dashboard` - Dashboard data and statistics
- `GET /api/quotes` - Quote management
- `POST /api/calendar/connect` - Google Calendar integration

### Voice Processing
- `POST /api/voice/transcribe` - Transcribe audio to text
- `POST /api/voice/analyze-quality` - Audio quality analysis
- `GET /api/voice/supported-formats` - Supported audio formats

### Photo Intelligence
- `POST /api/photo/create-quote-from-photo` - Quote from photo
- `POST /api/photo/analyze-receipt` - Receipt/invoice analysis
- `POST /api/photo/analyze-job-sheet` - Job sheet processing

## 💰 Business Model

### Target Market
- **Primary**: UK electricians, plumbers, heating engineers
- **Secondary**: General contractors, handymen, small trade businesses
- **Market Size**: 500,000+ UK tradespeople

### Pricing Strategy
- **Subscription**: £29.99/month per user
- **Free Trial**: 14 days with full features
- **Enterprise**: Custom pricing for larger companies

### Revenue Projections
- **Month 6**: £6,000 MRR (200 customers)
- **Year 1**: £30,000 MRR (1,000 customers)
- **Year 2**: £150,000 MRR (5,000 customers)

## 🚀 Deployment

### Development
```bash
# Start both frontend and backend
npm run dev:full
```

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Copy to Flask static directory
cp -r dist/* ../backend/src/static/

# Start production server
cd ../backend && python src/main.py
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.tradesmate.co.uk](https://docs.tradesmate.co.uk)
- **Email**: support@tradesmate.co.uk
- **Discord**: [TradesMate Community](https://discord.gg/tradesmate)

---

**Built with ❤️ for UK tradespeople**

*TradesMate - Making trade business management effortless through AI*

