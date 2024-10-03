const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        await Promise.resolve(requestHandler(req, res, next))
        .catch((err)=>next(err))
    }
}

export {asyncHandler}


/**
 * // this is the breakdown of the uppermost function
 * function asyncHandler(requestHandler) {
    return function(req, res, next) {
        Promise.resolve(requestHandler(req, res, next))
            .catch(function(err) {
                next(err);
            });
    };
}
 */

// same thing can be achieved by try/catch block

// // const asyncHandler = (fn) => () => {}

// // const asyncHandler = (fn) => {() => {}}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.error(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
