import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
    const usersRepository = getCustomRepository(UsersRepository);

    const user = usersRepository.create({ name, email });

    const userAlreadyExists = await usersRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      throw new AppError("Usuário já existe!");
    }
    await usersRepository.save(user);

    return res.status(201).json(user);
  }

  async show(req: Request, res: Response) {
    const repository = getCustomRepository(UsersRepository);

    const all = await repository.find();

    return res.status(201).json(all);
  }

  async getUser(req: Request, res: Response) {
    const { id } = req.params;
    const repository = getCustomRepository(UsersRepository);
    const user = await repository.findOne({
      id,
    });

    if (!user) throw new AppError("Usuário não encontrado!");

    return res.status(201).json(user);
  }
}
export { UserController };
