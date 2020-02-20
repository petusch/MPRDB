import User from '../models/User'
import { ADMIN_ROLE, USER_ROLE, getRole } from '../constants/roles';
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, FORBIDDEN, NOT_FOUND } from 'http-status';

export const find = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.json({
      data: users,
      message: 'Success',
      statusCode: OK,
      success: true,
    }
    );
  } catch (error) {
    console.error(error);

    return res.status(INTERNAL_SERVER_ERROR).json({
      data: {},
      message: 'Error while get users',
      statusCode: INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};

export const findOneById = async (req, res) => {
  const {
    params: { user_id },
  } = req;
  try {
    const user = await User.findOneById(user_id);

    return res.json({
      data: user,
      message: 'Success',
      statusCode: OK,
      success: true,
    })
  } catch (error) {
    console.error(error);

    return res.status(NOT_FOUND).json({
      message: "User not found.",
      statusCode: NOT_FOUND,
      success: false,
    });
  }
};





export const create = async (req, res) => {
  const {
    body: {
      lastname,
      firstname,
      userData,
      login,
      password
    },
  } = req;
  try {
       if (!login || !password) {
      return res.status(BAD_REQUEST).json(
        {
          message: 'Incorrect login or (and) password',
          statusCode: BAD_REQUEST,
          success: false,
        }
      );
    }

    const user = new User({
      login,
      password,
      lastname,
      firstname,
      userData,
      roles: [USER_ROLE]
    });

    const savedUser = await user.save();

    return res.json(
      {
        data: savedUser,
        message: 'User created.',
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
    body: {
      lastname,
      firstname,   
      userData,
      password,
    },
    params: { user_id },
    user: { _id, roles: r },
  } = req;
  if (!r.includes(ADMIN_ROLE)) {
    if (_id != user_id) {
      return res.status(FORBIDDEN).json(
        {
          message: "Access denied.",
          statusCode: FORBIDDEN,
          success: false,
        }
      );
    };
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


    if (!password) {
      return res.status(BAD_REQUEST).json(
        {
          message: 'Password cannot be empty',
          statusCode: BAD_REQUEST,
          success: false,
        }
      );
    }

    user.password = password;
    user.lastname = lastname;
    user.firstname = firstname;
    user.userData = userData;
  

    await user.save();

    return res.json(
      {
        data: user,
        message: 'User updated.',
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

export const updateRole = async (req, res) => {
  const {
    body: { roles },
    params: { user_id },
    user: { roles: r },
  } = req;
  if (!r.includes(ADMIN_ROLE)) {
    return res.status(FORBIDDEN).json(
      {
        message: 'Access denied',
        statusCode: FORBIDDEN,
        success: false,
      },
    );
  }
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

    roles.forEach((role) => {
      if (!user.roles.includes(getRole(role))) {
        user.roles.push(getRole(role));
      }
    });

    await user.save();

    return res.json(
      {
        data: user,
        message: 'User roles updated.',
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
      }
    );
  }
};


export const deleteById = async (req, res) => {
  const {
    params: { user_id },
    user: { _id, roles: r }
  } = req;
  if (!r.includes(ADMIN_ROLE)) {
   // if (_id != user_id) {
      return res.status(FORBIDDEN).json(
        {
          message: "Access denied.",
          statusCode: FORBIDDEN,
          success: false,
        }
      );
    //}
  }
  try {
    const user = User.findOneById(user_id);

    if (!user) {
      return res.status(NOT_FOUND).json(
        {
          message: 'User not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    };

    User.deleteOneById(user_id);

    return res.json(
      {
        message: 'User deleted.',
        statusCode: OK
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