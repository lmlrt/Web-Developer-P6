
 
module.exports = (req, res, next) => {
   try {
    console.log(req.body);
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};