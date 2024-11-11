class FundraisingProject {
    id: string;
    title: string;
    goalAmount: number;
    raisedAmount: number;
    milestones: { description: string; amount: number; status: string }[]; // status can be "pending", "funded"
    createdAt: Date;
    updatedAt: Date | null;
  }
  
  const fundraisingStorage = StableBTreeMap<string, FundraisingProject>(0);
  
  app.post("/projects", (req, res) => {
    const project: FundraisingProject = {
      id: uuidv4(),
      createdAt: getCurrentDate(),
      raisedAmount: 0,
      milestones: req.body.milestones,
      ...req.body,
    };
    fundraisingStorage.insert(project.id, project);
    res.json(project);
  });
  
  app.put("/projects/:id/milestones/:milestoneIndex", (req, res) => {
    const projectId = req.params.id;
    const projectOpt = fundraisingStorage.get(projectId);
    const milestoneIndex = parseInt(req.params.milestoneIndex, 10);
  
    if (!projectOpt || !projectOpt.milestones[milestoneIndex]) {
      res.status(400).send(`Project or milestone not found`);
    } else {
      projectOpt.milestones[milestoneIndex].status = "funded";
      fundraisingStorage.insert(projectId, projectOpt);
      res.json(projectOpt);
    }
  });
  