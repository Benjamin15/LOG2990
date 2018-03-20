import { Document } from 'mongoose';
import { IPiste } from './../../../commun/interface/Piste';
import { IUser } from './../../../commun/interface/User';
import { IWord } from './../../../commun/interface/Word';
import { ICrossword } from './ICrossword';

export interface IWordModel extends IWord, Document { }
export interface IUserModel extends IUser, Document { }
export interface IPisteModel extends IPiste, Document { }
export interface ICrosswordModel extends ICrossword, Document { }
