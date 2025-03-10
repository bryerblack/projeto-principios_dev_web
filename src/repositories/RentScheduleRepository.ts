import RentSchedule from "../models/RentSchedule";

export class RentScheduleRepository {
  
  async createSchedules(schedules: { rentId: string; startDate: Date; endDate: Date }[]) {
    return await RentSchedule.bulkCreate(schedules);
  }

  async getSchedulesByRentId(rentId: string) {
    return await RentSchedule.findAll({ where: { rentId: rentId } });
  }

  async deleteSchedulesByRentId(rentId: string) {
    return await RentSchedule.destroy({ where: { rentId: rentId } });
  }
}
