import Doctor from '../models/Doctor'
import User from '../models/User'
import { ADMIN_ROLE, MEDSISTER_ROLE } from '../constants/roles';
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, FORBIDDEN, NOT_FOUND, NOT_ACCEPTABLE } from 'http-status';
import { ObjectID } from 'mongodb';

export const find = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();

    return res.json({
      data: doctors,
      message: 'Success',
      statusCode: OK,
      success: true,
    }
    );
  } catch (error) {
    console.error(error);

    return res.status(INTERNAL_SERVER_ERROR).json({
      data: {},
      message: 'Error while get doctors',
      statusCode: INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};

export const findOneById = async (req, res) => {
  const {
    params: { doctor_id },
  } = req;

  try {
    const doctor = await Doctor.findOneById(doctor_id);

    return res.json({
      data: doctor,
      message: 'Success',
      statusCode: OK,
      success: true,
    })
  } catch (error) {
    console.error(error);

    return res.status(NOT_FOUND).json({
      message: 'Doctor not found',
      statusCode: NOT_FOUND,
      success: false,
    });
  }
};

export const create = async (req, res) => {
  const {
    body: { name, surname, cabinet_number, adrees, speciality, user_id},
    user: { roles: r }
  } = req;
  if (!r.includes(ADMIN_ROLE) && !r.includes(MEDSISTER_ROLE)) {
    return res.status(FORBIDDEN).json(
      {
        message: "Access denied.",
        statusCode: FORBIDDEN,
        success: false,
      }
    );
  };
  
  try {
    const user = await User.findOneById(user_id);

    if (!user) {
      return res.status(NOT_FOUND).json(
        {
          message: 'User not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }



    const doctor = new Doctor({
        name,
        surname, 
        cabinet_number, 
        adrees, 
        speciality, 
        user_id
    });

    console.log(doctor);

    const savedDoctor = await doctor.save();

    return res.json(
      {
        data: savedDoctor,
        message: 'Create doctor',
        success: true,
        statusCode: OK
      },
    );
  } catch (error) {
    console.error(error);

    return res.status(NOT_FOUND).json(
      {
        message: 'User not found',
        statusCode: NOT_FOUND,
        success: false,
      },
    );
  }
};

export const update = async (req, res) => {
  const {
    body: { name, surname, cabinet_number, adrees, speciality, user_id },
    params: { doctor_id },
    user: { roles: r }
  } = req;
  if (!r.includes(ADMIN_ROLE) && !r.includes(MEDSISTER_ROLE)) {
    return res.status(FORBIDDEN).json(
      {
        message: "Access denied.",
        statusCode: FORBIDDEN,
        success: false,
      }
    );
  };
  try {
    const user = await User.findOneById(user_id);
    if (!user) {
      return res.status(NOT_FOUND).json(
        {
          message: 'User not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }

    const doctor = await Doctor.findOneById(doctor_id);
    if (!doctor) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Doctor not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }
    doctor.name = name;
    doctor.surname = surname;
    doctor.cabinet_number = cabinet_number;
    doctor.adrees = adrees;
    doctor.speciality = speciality;
    doctor.user_id = user_id;
    

    await doctor.save();

    return res.json(
      {
        data: doctor,
        message: 'Doctor updated.',
        statusCode: OK,
        success: true
      },
    );
  } catch (error) {
    console.error(error);

    return res.status(BAD_REQUEST).json(
      {
        message: error,
        statusCode: BAD_REQUEST,
        success: false,
      }
    );
  }
};

export const deleteById = async (req, res) => {
  const {
    params: { doctor_id },
    user: { roles: r }
  } = req;
  if (!r.includes(ADMIN_ROLE) && !r.includes(MEDSISTER_ROLE)) {
    return res.status(FORBIDDEN).json(
      {
        message: "Access denied.",
        statusCode: FORBIDDEN,
        success: false,
      }
    );
  };
  try {
    const doctor = Doctor.findOneById(doctor_id);

    if (!doctor) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Doctor not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    };

    Doctor.deleteOneById(doctor_id);

    return res.json(
      {
        message: 'Doctor deleted.',
        statusCode: OK,
        success: true
      },
    );
  }
  catch (error) {
    console.error(error);

    return res.status(BAD_REQUEST).json(
      {
        message: error,
        statusCode: BAD_REQUEST,
        success: false,
      }
    );
  }
};