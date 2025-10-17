import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WellnessTheme } from '../../utils/wellnessTheme';

export default function BreathingMeditationScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime] = useState(300); // 5 minutes
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale' | 'hold'>('inhale');
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalTime]);

  useEffect(() => {
    if (isPlaying) {
      startBreathingAnimation();
    } else {
      stopBreathingAnimation();
    }
  }, [isPlaying]);

  const startBreathingAnimation = () => {
    const breathingCycle = () => {
      // Inhale (4 seconds)
      setBreathPhase('inhale');
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.9,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold (1 second)
        setBreathPhase('hold');
        setTimeout(() => {
          // Exhale (4 seconds)
          setBreathPhase('exhale');
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 4000,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (isPlaying) {
              breathingCycle();
            }
          });
        }, 1000);
      });
    };
    breathingCycle();
  };

  const stopBreathingAnimation = () => {
    scaleAnim.stopAnimation();
    opacityAnim.stopAnimation();
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.6,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Inhale...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Exhale...';
      default:
        return 'Breathe...';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#DDD6FE', '#C4B5FD', '#A78BFA']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={WellnessTheme.colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.sessionInfo}>
            <Icon name="music" size={20} color={WellnessTheme.colors.textPrimary} />
            <Text style={styles.sessionType}>Ocean breeze</Text>
            <Icon name="chevron-down" size={20} color={WellnessTheme.colors.textPrimary} />
          </View>
        </View>

        {/* Session Details */}
        <View style={styles.sessionDetails}>
          <Text style={styles.duration}>5 minutes</Text>
          <Text style={styles.title}>Breathing meditation</Text>
        </View>

        {/* Breathing Animation */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.characterContainer}>
              <View style={styles.character}>
                <View style={styles.hair} />
                <View style={styles.face}>
                  <View style={styles.eyes}>
                    <View style={styles.eye} />
                    <View style={styles.eye} />
                  </View>
                  <View style={styles.nose} />
                  <View style={styles.mouth} />
                </View>
                <View style={styles.body}>
                  <View style={styles.shirt} />
                  <View style={styles.arms}>
                    <View style={styles.arm} />
                    <View style={styles.arm} />
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Breathing Instruction */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>{getBreathingInstruction()}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
          >
            <Icon 
              name={isPlaying ? 'pause' : 'play'} 
              size={24} 
              color={WellnessTheme.colors.white} 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingTop: WellnessTheme.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: WellnessTheme.spacing.md,
    paddingVertical: WellnessTheme.spacing.sm,
    borderRadius: WellnessTheme.borderRadius.xl,
  },
  sessionType: {
    fontSize: WellnessTheme.fontSize.sm,
    color: WellnessTheme.colors.textPrimary,
    marginHorizontal: WellnessTheme.spacing.sm,
  },
  sessionDetails: {
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    marginTop: WellnessTheme.spacing.xl,
  },
  duration: {
    fontSize: WellnessTheme.fontSize.md,
    color: WellnessTheme.colors.textSecondary,
    marginBottom: WellnessTheme.spacing.xs,
  },
  title: {
    fontSize: WellnessTheme.fontSize.xxl,
    fontWeight: 'bold',
    color: WellnessTheme.colors.textPrimary,
    textAlign: 'center',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: WellnessTheme.spacing.xxxl,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    alignItems: 'center',
  },
  hair: {
    width: 60,
    height: 40,
    backgroundColor: '#4F46E5',
    borderRadius: 30,
    marginBottom: -10,
  },
  face: {
    width: 50,
    height: 50,
    backgroundColor: '#FBBF24',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  eyes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 20,
    marginBottom: 5,
  },
  eye: {
    width: 4,
    height: 4,
    backgroundColor: WellnessTheme.colors.textPrimary,
    borderRadius: 2,
  },
  nose: {
    width: 2,
    height: 2,
    backgroundColor: '#F59E0B',
    borderRadius: 1,
    marginBottom: 3,
  },
  mouth: {
    width: 8,
    height: 4,
    backgroundColor: '#DC2626',
    borderRadius: 4,
  },
  body: {
    alignItems: 'center',
    marginTop: -5,
  },
  shirt: {
    width: 40,
    height: 30,
    backgroundColor: '#EC4899',
    borderRadius: 15,
  },
  arms: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
    marginTop: -15,
  },
  arm: {
    width: 8,
    height: 20,
    backgroundColor: '#FBBF24',
    borderRadius: 4,
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: WellnessTheme.spacing.xl,
  },
  instruction: {
    fontSize: WellnessTheme.fontSize.lg,
    color: WellnessTheme.colors.textPrimary,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingBottom: WellnessTheme.spacing.xl,
  },
  timeDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: WellnessTheme.spacing.lg,
    paddingVertical: WellnessTheme.spacing.md,
    borderRadius: WellnessTheme.borderRadius.xl,
  },
  timeText: {
    fontSize: WellnessTheme.fontSize.lg,
    fontWeight: '600',
    color: WellnessTheme.colors.textPrimary,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: WellnessTheme.colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...WellnessTheme.shadows.md,
  },
});