import Patient from '../postgres/models/Patient'
import Diagnose from '../postgres/models/Diagnose'
import PatientDiagnose from '../postgres/models/PatientDiagnose'
import Doctor from '../postgres/models/Doctor'
import User from '../postgres/models/User'
import '../constants/roles';
import { ADMIN_ROLE, MEDSISTER_ROLE } from '../constants/roles';
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, FORBIDDEN, NOT_FOUND } from 'http-status';


export const find = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: {
        model: Diagnose,
        as: 'diagnoses',
        through: { attributes: [] }
      },
    });

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
      message: 'Error while get patient',
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
    const patient = await Patient.findOne({
      include: {
        model: Diagnose,
        as: 'diagnoses',
        through: { attributes: [] }
      },
      where: { id: patient_id }
    });

    if (!patient) {
      return res.status(NOT_FOUND).json({
        message: "Patient not found.",
        statusCode: NOT_FOUND,
        success: false,
      });
    }

    return res.json({
      data: patient,
      message: 'Success',
      statusCode: OK,
      success: true,
    })
  } catch (error) {
    console.error(error);

    return res.status(BAD_REQUEST).json({
      data: {},
      message: error,
      statusCode: BAD_REQUEST,
      success: false,
    });
  }
};

export const create = async (req, res) => {
  const {
    body: { userId, diagnoses, doctorId },
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

     const doctor = await Doctor.findByPk(doctorId);

    if (!doctor) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Doctor not found',
          statusCode: NOT_FOUND,
          success: false,
        },
      );
    }


    const { id: patientId } = await Patient.create({
      userId,
      doctorId
    });

    await Promise.all(
      diagnoses.map(
        async (d) => {
          const [{ id: diagnoseId }] = await Diagnose.findOrCreate({
            where: { name: d.name }
          });
          await PatientDiagnose.create({
            patientId,
            diagnoseId
          });
        }
      )
    );

    const savedPatient = await Patient.findOne({
      include: {
        model: Diagnose,
        as: 'diagnoses',
        through: { attributes: [] }
      },
      where: { id: patientId }
    });

    return res.json(
      {
        data: savedPatient,
        message: 'Patient created.',
        statusCode: OK
      },
    );
  } catch (error) {
    console.error(error);

    return res.status(BAD_REQUEST).json(
      {
        message: error,
        statusCode: BAD_REQUEST,
        success: false,
      },
    );
  }
};

export const update = async (req, res) => {
  const {
    body: { diagnoses, userId, doctorId },
    params: { patient_id },
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

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Doctor not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }


    const patient = await Patient.findByPk(patient_id);

    if (!patient) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Patient not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }

    await Patient.update(
      {
        userId,
        doctorId
      },
      {
        where: { id: patient_id }
      });

    if (diagnoses) {
      const existingDiagnoses = (await PatientDiagnose.findAll(
        {
          where: { patientId: patient_id }
        }
      )).map(({ diagnoseId }) => diagnoseId);

      const newDiagnoses = await Promise.all(
        diagnoses.map(async diagnose => {
          const [{ id: diagnoseId }] = await Diagnose.findOrCreate({
            where: { name: diagnose.name }
          });

          if (!existingDiagnoses.includes(diagnoseId)) {
            await PatientDiagnose.create({
              patientId: patient_id,
              diagnoseId: diagnoseId
            });
          }
          return diagnoseId;
        })
      );

      await Promise.all(
        existingDiagnoses.map(async diagnoseId => {
          if (!newDiagnoses.includes(diagnoseId)) {
            await PatientDiagnose.destroy({
              where: {
                patientId: patient_id,
                diagnoseId: diagnoseId
              }
            })
          }
        })
      );
    }
    const updatedPatient = await Patient.findOne({
      include: {
        model: Diagnose,
        as: 'diagnoses',
        through: { attributes: [] }
      },
      where: { id: patient_id }
    });

    return res.json(
      {
        data: updatedPatient,
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
    const patientId = patient_id;
    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(NOT_FOUND).json(
        {
          message: 'Patient not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    };

    await PatientDiagnose.destroy({
      where: { patientId }
    });

    await Patient.destroy({
      where: { id: patientId }
    });

    return res.status(OK).json(
      {
        message: 'Patient deleted.',
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