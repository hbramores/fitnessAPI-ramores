const Workout = require('../models/Workout');
const { errorHandler } = require("../auth");

module.exports.addWorkout = (req, res) => {

    let newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        userId: req.body.userId
    });

    Workout.findOne({ name: req.body.name, userId: req.body.userId })
        .then(existingWorkout => {

            if (existingWorkout) {
                return res.status(409).send({
                    message: 'Workout already exists'
                });
            } else {
                return newWorkout.save()
                    .then(result => res.status(201).send({
                        success: true,
                        message: 'Workout added successfully',
                        result: result
                    }))
                    .catch(error => errorHandler(error, req, res));
            }
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.getMyWorkouts = (req, res) => {

    return Workout.find({ userId: req.user.id })
        .then(result => {

            if (result.length > 0) {
                return res.status(200).send({
                    success: true,
                    workouts: result
                });
            } else {
                return res.status(404).send({
                    message: 'No workout found'
                });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.updateWorkout = (req, res) => {

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration
    };

    return Workout.findOneAndUpdate(
        { _id: req.params.workoutId, userId: req.body.userId },
        updatedWorkout,
        { new: true }
    )
    .then(workout => {

        if (workout) {
            return res.status(200).send({
                success: true,
                message: "Workout updated successfully",
                updatedWorkout: workout
            });
        } else {
            return res.status(404).send({
                success: false,
                message: "Workout not found"
            });
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.deleteWorkout = (req, res) => {

    return Workout.findOneAndDelete({
        _id: req.params.workoutId,
        userId: req.body.userId
    })
    .then(workout => {

        if (workout) {
            return res.status(200).send({
                success: true,
                message: "Workout deleted successfully"
            });
        } else {
            return res.status(404).send({
                success: false,
                message: "Workout not found"
            });
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.completeWorkoutStatus = (req, res) => {

    return Workout.findOne({
        _id: req.params.workoutId,
        userId: req.body.userId
    })
    .then(workout => {

        if (!workout) {
            return res.status(404).send({
                success: false,
                message: "Workout not found"
            });
        }

        workout.status = !workout.status;

        return workout.save()
            .then(updatedWorkout => {
                return res.status(200).send({
                    success: true,
                    message: "Workout status updated successfully",
                    updatedWorkout: updatedWorkout
                });
            });
    })
    .catch(error => errorHandler(error, req, res));
};