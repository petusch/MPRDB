import Doctor from '../postgres/models/Doctor'
import User from '../postgres/models/User'
import Speciality from '../postgres/models/Speciality'
import { ADMIN_ROLE, MEDSISTER_ROLE } from '../constants/roles';
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, FORBIDDEN, NOT_FOUND, NOT_ACCEPTABLE } from 'http-status';

export const find = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [User, Speciality]
    });

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
    const doctor = await Doctor.findOne({
      include: [User, Speciality],
      where: { id: doctor_id }
    });

    if (!doctor) {
      return res.status(NOT_FOUND).json({
        message: 'Doctor not found',
        statusCode: NOT_FOUND,
        success: false,
      });
    }

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
    body: { cabinet_number, userId, specialityId },
    user: { role: { name: r } }
  } = req;
  if (r !== ADMIN_ROLE) {
    return res.status(FORBIDDEN).json(
      {
        message: "Access denied.",
        statusCode: FORBIDDEN,
        success: false,
      }
    );
  };
  try {
    
    const speciality = await Speciality.findByPk(specialityId);

    if (!speciality) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Speciality not found',
          statusCode: NOT_FOUND,
          success: false,
        },
      );
    }


    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(NOT_FOUND).json(
        {
          message: 'User not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }

    

    const { id: doctorId } = await Doctor.create({
      cabinet_number, 
      userId, 
      specialityId 
    });

    const createdDoctor = await Doctor.findOne({
      include: [User, Speciality],
      where: { id: doctorId }
    });

    return res.json(
      {
        data: createdDoctor,
        message: 'Create doctor',
        statusCode: OK
      },
    );
  } catch (error) {
    console.error(error);

    return res.status(NOT_FOUND).json(
      {
        message: 'Speciality or user not found',
        statusCode: NOT_FOUND,
        success: false,
      },
    );
  }
};

export const update = async (req, res) => {
  const {
    body: { cabinet_number, userId, specialityId },
    params: { doctor_id },
    user: { role: { name: r } }
  } = req;
  if (r !== ADMIN_ROLE) {
    return res.status(FORBIDDEN).json(
      {
        message: "Access denied.",
        statusCode: FORBIDDEN,
        success: false,
      }
    );
  };
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(NOT_FOUND).json(
        {
          message: 'User not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }

    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Doctor not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }

   

    await Doctor.update(
      {
        cabinet_number,
         userId, 
         specialityId
      },
      {
        where: { id: doctor_id }
      }
    );

    const updatedDoctor = await Doctor.findOne({
      include: [User, Speciality],
      where: { id: doctor_id }
    });

    return res.json(
      {
        data: updatedDoctor,
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
    user: { role: { name: r } }
  } = req;
  if (r !== ADMIN_ROLE && r !== MEDSISTER_ROLE) {
    return res.status(FORBIDDEN).json(
      {
        message: "Access denied.",
        statusCode: FORBIDDEN,
        success: false,
      }
    );
  };
  try {
    const doctor = Doctor.findByPk(doctor_id);

    if (!doctor) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Doctor not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    };

    await Doctor.destroy({
      where: { id: doctor_id }
    });

    return res.json(
      {
        message: 'Doctor deleted.',
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