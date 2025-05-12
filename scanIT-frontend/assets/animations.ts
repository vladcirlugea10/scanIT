import { Keyframe } from 'react-native-reanimated';

export const waveKeyframe = new Keyframe({
    0:{
        transform: [{ rotate: '0deg' }],
    },
    15:{
        transform: [{ rotate: '20deg' }],
    },
    30:{
        transform: [{ rotate: '-10deg' }],
    },
    40:{
        transform: [{ rotate: '20deg' }],
    },
    50:{
        transform: [{ rotate: '-8deg' }],
    },
    60:{
        transform: [{ rotate: '16deg' }],
    },
    70:{
        transform: [{ rotate: '-8deg' }],
    },
    100:{
        transform: [{ rotate: '0deg' }],
    }
});