module.exports = function(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Utilisateur non authentifié" });
  }

  if (req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ message: "Accès interdit : Réservé aux administrateurs" }); 
  }
};