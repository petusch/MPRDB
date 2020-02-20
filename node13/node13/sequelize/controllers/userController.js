import User from '../postgres/models/User'
import Role from '../postgres/models/Role'
import UserInfo from '../postgres/models/UserInfo'
import { ADMIN_ROLE, USER_ROLE, getRole } from '../constants/roles';
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, FORBIDDEN, NOT_FOUND } from 'http-status';

export const find = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [UserInfo, Role],
    });

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
    const user = await User.findOne({
      include: [UserInfo, Role],
      where: { id: user_id }
    });
    if (!user) {
      return res.status(NOT_FOUND).json({
        message: "User not found.",
        statusCode: NOT_FOUND,
        success: false,
      });
    }
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
      login,
      password,
      lastname,
      firstname,
      dob,
      image,
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

    const existingUser = await User.findOne({
      where: { login }
    })

    if (existingUser) {
      return res.status(BAD_REQUEST).json(
        {
          message: 'Login already exist',
          statusCode: BAD_REQUEST,
          success: false,
        });
    }

    const { id: roleId } = await Role.findOne({
      where: {
        name: USER_ROLE
      }
    });

    const user = await User.create({
      login,
      password,
      roleId
    });

    const { id: userId } = user;

    await UserInfo.create({
      userId,
      lastname,
      firstname,
      dob,
      image
    });

    return res.json(
      {
        data: user,
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
      password,
      lastname,
      firstname,
      dob,
      image
    },
    params: { user_id },
    user: {
      id,
      role: { name: r }
    },
  } = req;
  if (r !== ADMIN_ROLE) {
    if (id != user_id) {
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
    const user = await User.findByPk(user_id);

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

    await User.update(
      {
        password,
      }, 
      {
        where: { id: user_id }
      }
    );

    await UserInfo.update(
      {
        lastname,
        firstname,
        dob,
        image
      },
      {
        where: { userId: user_id }
      }
    );

    const savedUser = await User.findOne({
      include: [UserInfo, Role],
      where: { id: user_id }
    });

    return res.status(OK).json(
      {
        data: savedUser,
        statusCode: OK,
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
    body: { role },
    params: { user_id },
    user: { role: { name: r } },
  } = req;
  if (r !== ADMIN_ROLE) {
    return res.status(FORBIDDEN).json(
      {
        message: 'Access denied',
        statusCode: FORBIDDEN,
        success: false,
      },
    );
  }
  try {
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(NOT_FOUND).json(
        {
          message: 'User not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    }

    const { id: roleId } = await Role.findOne({ where: { name: role } });

    if (!roleId) {
      return res.status(BAD_REQUEST).json(
        {
          message: 'Incorrect role',
          statusCode: BAD_REQUEST,
          success: false,
        }
      );
    }

    await User.update(
      {
        roleId
      },
      {
        where: { id: user_id }
      }
    );

    return res.status(OK).json(
      {
        data: user,
        statusCode: OK,
        message: 'User role updated.',
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
    user: { id, role: { name: r } }
  } = req;
  if (r !== ADMIN_ROLE) {
    if (id != user_id) {
      return res.status(FORBIDDEN).json(
        {
          message: "Access denied.",
          statusCode: FORBIDDEN,
          success: false,
        }
      );
    }
  }
  try {
    const user = User.findByPk(user_id);

    if (!user) {
      return res.status(NOT_FOUND).json(
        {
          message: 'User not found',
          statusCode: NOT_FOUND,
          success: false,
        }
      );
    };

    await User.destroy({
      where: { id: user_id }
    });

    return res.json(
      {
        message: 'User deleted.',
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