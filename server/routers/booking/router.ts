import { listBookings } from './queries/list-bookings';
import { createBooking } from './mutations/create-booking';
import { updateBookingStatus } from './mutations/update-booking-status';
import { cancelBooking } from './mutations/cancel-booking';
import { listBookingsForMedical } from '@/server/routers/booking/queries/list-medical-bookings';
import { acceptBooking } from '@/server/routers/booking/mutations/accept-booking';

export const bookingRouter = {
  list: listBookings,
  accept: acceptBooking,
  listMedical: listBookingsForMedical,
  create: createBooking,
  updateStatus: updateBookingStatus,
  cancel: cancelBooking,
};
