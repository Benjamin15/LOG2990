import { CarManagerAudio } from './car-manager-audio';
import { ManagerAudio } from './manager-audio';


export class SingletonAudio {
    public static managerAudio: ManagerAudio;
    public static carManagerAudio: CarManagerAudio;

    public instanceAudio(): ManagerAudio {
        if (!SingletonAudio.managerAudio) {
            SingletonAudio.managerAudio = new ManagerAudio();
        }
        return SingletonAudio.managerAudio;
    }

    public instanceCarAudio(): CarManagerAudio {
        if (!SingletonAudio.carManagerAudio) {
            SingletonAudio.carManagerAudio = new CarManagerAudio();
        }
        return SingletonAudio.carManagerAudio;
    }
}
