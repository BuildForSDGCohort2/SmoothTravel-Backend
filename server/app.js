import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {graphqlHTTP} from 'express-graphql'
import {buildSchema} from 'graphql'

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const Reservations = [
	{
		location: 'Lusaka',
		checkin_date: '1600966570381',
		checkout_date: '1600966603898',
		number_of_rooms: 2,
		cost_per_night: 200,
		number_of_people: { adults: 2, children: 2, pets: 1 }
	}
];

const Bookings = [
	{
		departure: 'Lusaka',
		destination: 'Nairobi',
		departure_date: '1600967084953',
		flight_type: 'one-way',
		cabin_class: 'economy',
		number_of_people: { adults: 2, children: 2, pets: 1 }
	}
];

app.use(
	'/graphql',
	graphqlHTTP({
		schema: buildSchema(`
      type Reservation {
        location: String!
        checkin_date: String!
        checkout_date: String!
        number_of_rooms: Int!
        cost_per_night: Int!
        number_of_people: NumberOfPeople 
      }

      type Booking {
        departure: String!
        destination: String!
        departure_date: String!
        flight_type: String!
        cabin_class: String! 
        number_of_people: NumberOfPeople
      }

      type NumberOfPeople {
        adults: Int!
        children: Int!
        pets: Int!
      }

      input NumberOfPeopleInput {
        adults: Int!
        children: Int!
        pets: Int!
      }

      input ReservationInput {
        location: String!
        checkin_date: String!
        checkout_date: String!
        number_of_rooms: Int!
        cost_per_night: Int!
        number_of_people: [NumberOfPeopleInput!]!
      }

      input BookingInput {
        departure: String!
        destination: String!
        departure_date: String!
        flight_type: String!
        cabin_class: String!
        number_of_people: [NumberOfPeopleInput!]!
      }

      type Query {
        getReservations: [Reservation!]!
        getBookings: [Booking!]!
      }

      type Mutation {
        makeReservation(reservationInput: ReservationInput): Reservation
        bookFlight(bookingInput: BookingInput): Booking
      }

      schema {
        query: Query
        mutation: Mutation
      }
  `),
		rootValue: {
			getReservations: () => {
				return Reservations;
			},
			getBookings: () => {
				return Bookings;
			},
			bookFlight: (args) => {
				const Arguments = { ...args.bookingInput };
				let departure = Arguments.departure;
				let destination = Arguments.destination;
				let departureDate = Arguments.departure_date;
				let flightType = Arguments.flight_type;
				let cabinClass = Arguments.cabin_class;
				let people = Arguments.number_of_people[0];
				let numberOfPeople = { ...people };

				console.log(numberOfPeople);

				let booking = {
					departure: departure,
					destination: destination,
					departure_date: departureDate,
					flight_type: flightType,
					cabin_class: cabinClass,
					number_of_people: numberOfPeople
				};

				Bookings.push(booking);
				return booking;
			},
			makeReservation: (args) => {
				const Arguments = { ...args.reservationInput };
				let location = Arguments.location;
				let checkInDate = Arguments.checkin_date;
				let CheckOutDate = Arguments.checkout_date;
				let numberOfRooms = Arguments.number_of_rooms;
				let costPerNight = Arguments.cost_per_night;
				let people = Arguments.number_of_people[0];
				let numberOfPeople = { ...people };
				let reservation = {
					location: location,
					checkin_date: checkInDate,
					checkout_date: CheckOutDate,
					number_of_rooms: numberOfRooms,
					cost_per_night: costPerNight,
					number_of_people: numberOfPeople
				};

				Reservations.push(reservation);
				return reservation;
			}
		},
		graphiql: true
	})
);

export default app;
