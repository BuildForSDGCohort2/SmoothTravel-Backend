import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {graphqlHTTP} from 'express-graphql'
import {buildSchema} from 'graphql'

import indexRouter from './routes/index';
import usersRouter from './routes/users';

import Reservation from './models/reservation';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const Bookings = [
	{
		departure: 'Lusaka',
		departureDate: '',
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
				_id: ID!
				booked_on: String!
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
				return Reservation.find()
				.then((reservations) => {
					return reservations.map((reservation) => {
						return {
							...reservation._doc,
							_id: reservation._doc._id.toString(),
							booked_on: reservation._doc._id.getTimestamp()
						};
					});
				})
				.catch((err) => {
					console.log(err);
					throw err;
				});
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
				const numberOfPeople = {...Arguments.number_of_people[0]}
				const reservation = new Reservation({
					location: Arguments.location,
					checkin_date: Arguments.checkin_date,
					checkout_date: Arguments.checkout_date,
					number_of_rooms: Arguments.number_of_rooms,
					cost_per_night: Arguments.cost_per_night,
					number_of_people: numberOfPeople
				})
				return reservation.save().then(result => {
					return {
						...result._doc,
						_id: result._doc._id.toString(),
						booked_on: result._doc._id.getTimestamp().toString()
					};
				})
				.catch((err) => {
					console.log(err);
					throw err;
				});
			}
		},
		graphiql: true
	})
);

export default app;
