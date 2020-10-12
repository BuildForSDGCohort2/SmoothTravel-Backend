import mongoose, {Schema} from 'mongoose';

// helper function to determine the date from today using 
// number of days
const DateFromToday = (date, daysElapsed) => {
  const dateFromToday = date;
  const unixDate = dateFromToday.setDate(date.getDay() + daysElapsed)
  return unixDate;
}

const reservationSchema = new Schema({
  booked_on: {
    type: Date,
    default: Date.now()
  },
  location: {
    type: String,
    required: true
  },
  checkin_date: {
    type: String,
    default: `"${DateFromToday(new Date(), 1)}"`,
    required: true
  },
  checkout_date: {
    type: String,
    default: `"${DateFromToday(new Date(), 2)}"`,
    required: true
  },
  number_of_rooms: {type: Number, required: true},
  cost_per_night: {
    type: Number,
    required: true
  },
  number_of_people: {
    adults: {type: Number,default: 1, required: true},
    children: {type: Number, default: 0, required: true},
    pets: {type: Number, default: 0, required: true}
  }
})

module.exports = mongoose.model('Reservation', reservationSchema)