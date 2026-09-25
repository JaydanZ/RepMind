import { Workout } from '@/types/programCreation'

// Example output shown on the landing page. Illustrative only, not a real user's program.
export const SAMPLE_PROFILE = [
  { question: 'Fitness goal', answer: 'Gain muscle' },
  { question: 'Experience', answer: '2 - 3 years' },
  { question: 'Days per week', answer: '4 days' },
  { question: 'About you', answer: '27 years, 175 lbs, male' }
]

export const SAMPLE_WEEK: Workout[] = [
  {
    day: 'Monday',
    focus: 'Upper body',
    exercises: [
      {
        name: 'Barbell Bench Press',
        sets: 4,
        reps: 6,
        exercise_tip:
          'Pin your shoulder blades back and keep your feet planted so the bar path stays over your mid chest.'
      },
      {
        name: 'Bent-Over Row',
        sets: 4,
        reps: 8,
        exercise_tip:
          'Hinge until your torso is near 45 degrees and pull the bar to your lower ribs, not your chest.'
      },
      {
        name: 'Seated Dumbbell Press',
        sets: 3,
        reps: 10,
        exercise_tip:
          'Stop just short of locking out to keep tension on the shoulders between reps.'
      },
      {
        name: 'Lat Pulldown',
        sets: 3,
        reps: 10,
        exercise_tip:
          'Lead with your elbows and pause briefly with the bar at your collarbone.'
      },
      {
        name: 'Triceps Pushdown',
        sets: 3,
        reps: 12,
        exercise_tip:
          'Keep your elbows glued to your sides so the triceps do all the work.'
      }
    ]
  },
  {
    day: 'Tuesday',
    focus: 'Lower body',
    exercises: [
      {
        name: 'Back Squat',
        sets: 4,
        reps: 6,
        exercise_tip:
          'Brace before you descend and push your knees out in line with your toes.'
      },
      {
        name: 'Romanian Deadlift',
        sets: 3,
        reps: 8,
        exercise_tip:
          'Push your hips back with soft knees until you feel a stretch in the hamstrings.'
      },
      {
        name: 'Walking Lunge',
        sets: 3,
        reps: 10,
        exercise_tip:
          'Take a long enough step that your front shin stays close to vertical.'
      },
      {
        name: 'Lying Leg Curl',
        sets: 3,
        reps: 12,
        exercise_tip: 'Lower the weight over three seconds on every rep.'
      },
      {
        name: 'Standing Calf Raise',
        sets: 4,
        reps: 12,
        exercise_tip: 'Hold the top position for a full second before lowering.'
      }
    ]
  },
  {
    day: 'Thursday',
    focus: 'Upper body',
    exercises: [
      {
        name: 'Incline Dumbbell Press',
        sets: 4,
        reps: 8,
        exercise_tip:
          'Set the bench to around 30 degrees to bias the upper chest without loading the shoulders.'
      },
      {
        name: 'Pull-Up',
        sets: 4,
        reps: 6,
        exercise_tip:
          'Start each rep from a dead hang and drive your elbows toward your hips.'
      },
      {
        name: 'Cable Lateral Raise',
        sets: 3,
        reps: 15,
        exercise_tip:
          'Raise to shoulder height only and keep a slight bend in the elbow.'
      },
      {
        name: 'Chest-Supported Row',
        sets: 3,
        reps: 10,
        exercise_tip:
          'Keep your chest on the pad so momentum cannot help the lift.'
      },
      {
        name: 'Dumbbell Curl',
        sets: 3,
        reps: 12,
        exercise_tip: 'Supinate your wrist as you curl for a stronger contraction.'
      }
    ]
  },
  {
    day: 'Friday',
    focus: 'Lower body',
    exercises: [
      {
        name: 'Deadlift',
        sets: 3,
        reps: 5,
        exercise_tip:
          'Pull the slack out of the bar before it leaves the floor and keep it against your legs.'
      },
      {
        name: 'Leg Press',
        sets: 3,
        reps: 10,
        exercise_tip:
          'Lower until your hips are about to tuck, then press through your whole foot.'
      },
      {
        name: 'Bulgarian Split Squat',
        sets: 3,
        reps: 8,
        exercise_tip:
          'Keep most of your weight on the front foot; the back leg is only for balance.'
      },
      {
        name: 'Hip Thrust',
        sets: 3,
        reps: 10,
        exercise_tip:
          'Tuck your chin and finish each rep by squeezing the glutes, not arching the back.'
      },
      {
        name: 'Hanging Knee Raise',
        sets: 3,
        reps: 12,
        exercise_tip: 'Curl your pelvis up at the top instead of just lifting the knees.'
      }
    ]
  }
]
