# Eventrix - Event Management System

A comprehensive event management platform for organizing college events, tracking attendance, managing equipment bookings, and maintaining student records.

## Features

- **Dashboard**: Overview of upcoming events, equipment availability, and system statistics
- **Events Management**: Create, view, and manage events with organizers and attendees
- **Attendance System**: Mark and track student attendance for each event in real-time
- **Equipment Tracking**: Monitor equipment inventory, bookings, and availability status
- **User Management**: Manage organizers, volunteers, and participants (322+ students)
- **Booking System**: Book equipment for events and track returns
- **Students Directory**: Complete student roster with search and filter capabilities

## Quick Start

### Prerequisites

- Java 17 or higher
- MySQL or SQL database
- Maven (for building the project)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Naeha-S/Eventrix.git
   cd Eventrix
   ```

2. **Set up the database**
   - Create a new database named `eventrix`
   - Import the schema:
     ```bash
     mysql -u root -p eventrix < database/schema.sql
     ```
   - Load sample data:
     ```bash
     mysql -u root -p eventrix < database/sample_data.sql
     ```

3. **Configure database connection**
   - Open `application.properties`
   - Update database credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/eventrix
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

4. **Build and run the application**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Access the application**
   - Open your browser and go to: `http://localhost:8080`

## Database Schema

The system uses the following main tables:

- **users** - Students, organizers, and participants (322 pre-loaded)
- **events** - Event details with dates, venues, and descriptions (12 sample events)
- **equipment** - Inventory of available equipment (10 items)
- **bookings** - Equipment bookings linked to events (37 bookings)
- **checkins** - Attendance records for events (9 sample records)

### Key Relationships

```
Users ──(1:M)── Events ──(1:M)── CheckIns
  │                │
  │                │
  └──(1:M)── Bookings ──(M:1)── Equipment
```

## Key Functionality

### Attendance Marking
- Search students by name or 9-digit roll number
- Real-time attendance updates
- Automatic duplicate check-in prevention
- View complete attendance history per event

### Equipment Management
- Track 10+ equipment items (projectors, laptops, sound systems, furniture, etc.)
- Status monitoring: Available / Borrowed / Damaged
- Booking assignments with dates and return tracking
- Complete booking history for each equipment

### Event Organization
- 12 pre-loaded sample events (Tech Symposium, Hackathon, Cultural Fest, etc.)
- Full CRUD operations (Create, Read, Update, Delete)
- Organizer assignments from student database
- Equipment and attendance tracking per event

## Pre-loaded Data

The application comes with sample data ready to use:

- **322 students** - Complete roster from `Students_data.csv`
- **12 events** - Mix of upcoming, planning, and completed events
- **10 equipment items** - Electronics, furniture, and display items
- **37 equipment bookings** - Each event has relevant equipment assigned
- **9 attendance records** - Sample check-ins for completed events

## Database Files

Located in the `database/` directory:

- **`schema.sql`** - Complete database schema with all tables, constraints, and relationships
- **`sample_data.sql`** - Sample data for users, events, equipment, bookings, and check-ins
- **`queries.sql`** - Advanced SQL queries demonstrating database operations
- **`README.md`** - Detailed database documentation

## Project Structure

```
Eventrix/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/eventrix/
│   │   │       ├── controller/     # REST API controllers
│   │   │       ├── model/          # Entity classes
│   │   │       ├── repository/     # Database repositories
│   │   │       └── service/        # Business logic
│   │   └── resources/
│   │       ├── application.properties  # Configuration
│   │       └── static/             # Frontend files
│   └── test/                       # Unit tests
├── database/                       # SQL scripts
├── Students_data.csv              # Student roster (322 students)
└── pom.xml                        # Maven configuration
```

## Technologies

- **Backend**: Java 17 with Spring Boot
- **Database**: MySQL with SQL
- **ORM**: JPA/Hibernate for database operations
- **Frontend**: React with TypeScript
- **Build Tool**: Maven

## SQL Features Demonstrated

- Normalized database design (3NF)
- Primary and foreign key constraints
- Referential integrity with CASCADE actions
- Complex multi-table joins
- Aggregate functions and GROUP BY
- Subqueries and views
- Date/time operations
- Transaction management

## Usage Tips

### Running SQL Queries

To test database queries directly:

```bash
# Connect to MySQL
mysql -u root -p eventrix

# Run sample queries
mysql -u root -p eventrix < database/queries.sql
```

### Common Operations

1. **View all events**: Navigate to Events page
2. **Mark attendance**: Click "📋 Mark Attendance" on any event card
3. **Book equipment**: Go to Bookings page and select event and equipment
4. **Search students**: Use the Users or Students page with search filters

## Support

For issues or questions about the database setup or Java configuration, please refer to:
- Database documentation: `database/README.md`
- SQL schema: `database/schema.sql`

## License

Academic use only.

---

**Note**: This system uses Java Spring Boot with MySQL for robust, enterprise-grade event management. All data is persisted in the SQL database for reliability and consistency.
