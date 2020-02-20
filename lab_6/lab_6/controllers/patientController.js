import Patient from '../models/Patient'
import Doctor from '../models/Doctor'
import User from '../models/User'
import { ADMIN_ROLE, MEDSISTER_MODEL } from '../constants/roles';
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, FORBIDDEN, NOT_FOUND, NOT_ACCEPTABLE } from 'http-status';
import { ObjectID } from 'mongodb';

export const find = async (req, res) => {
  try {
    const patients = await Patient.findAll();

    return res.json({
      data: patients,
      message: 'Success',
      statusCode: OK,
      success: true,
    }
    );
  } catch (error) {
    console.error(error);

    return res.status(INTERNAL_SERVER_ERROR).json({
      data: {},
      message: 'Error while get patients',
      statusCode: INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};

export const findOneById = async (req, res) => {
  const {
    params: { patient_id },
  } = req;

  try {
    const patient = await Patient.findOneById(patient_id);

    return res.json({
      data: patient,
      message: 'Success',
      statusCode: OK,
      success: true,
    })
  } catch (error) {
    console.error(error);

    return res.status(NOT_FOUND).json({
      message: 'Patient not found',
      statusCode: NOT_FOUND,
      success: false,
    });
  }
};

export const create = async (req, res) => {
  const {
    body: { name, phone, diagnoses, doctor_id, user_id },
    user: { roles: r }
  } = req;
  if (!r.includes(ADMIN_ROLE) && !r.includes(MEDSISTER_MODEL)) {
    return res.status(FORBIDDEN).json(
      {
        message: "Access denied.",
        statusCode: FORBIDDEN,
        success: false,
      }
    );
  };
  try {
    const doctor = await Doctor.findOneById(doctor_id);

    if (!doctor) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Doctor not found',
          statusCode: NOT_FOUND,
          success: false,
        },
      );
    }

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



    const patient = new Patient({
      name,
      phone,
      diagnoses,
      doctor_id,
      user_id,
    });

    console.log(patient);

    const savedPatient = await patient.save();

    return res.json(
      {
        data: savedPatient,
        message: 'Create patient',
        statusCode: OK
      },
    );
  } catch (error) {
    console.error(error);

    return res.status(NOT_FOUND).json(
      {
        message: 'Doctor or user not found',
        statusCode: NOT_FOUND,
        success: false,
      },
    );
  }
};

export const update = async (req, res) => {
  const {
    body: {name, phone, diagnoses, doctor_id, user_id  },
    params: { patient_id },
    user: { roles: r }
  } = req;
  if (!r.includes(ADMIN_ROLE) && !r.includes(MEDSISTER_MODEL)) {
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
        },
      );
    }

    const patient = await Patient.findOneById(patient_id);
    if (!patient) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Patient not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }

    patient.name = name;
    patient.phone = phone;
    patient.diagnoses = diagnoses;
    patient.user_id = user_id;
    patient.doctor_id = doctor_id;

    await patient.save();

    return res.json(
      {
        data: patient,
        message: 'Patient updated.',
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
    params: { patient_id },
    user: { roles: r }
  } = req;
  if (!r.includes(ADMIN_ROLE) && !r.includes(MEDSISTER_MODEL)) {
    return res.status(FORBIDDEN).json(
      {
        message: "Access denied.",
        statusCode: FORBIDDEN,
        success: false,
      }
    );
  };
  try {
    const patient = Patient.findOneById(patient_id);

    if (!patient) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Patient not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    };

    Patient.deleteOneById(patient_id);

    return res.json(
      {
        message: 'Patient deleted.',
        statusCode: OK,
        success: true,
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