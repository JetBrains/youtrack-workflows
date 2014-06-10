SLA Management
====================

Define SLA
```java
statemachine Support management for field Support state { 
 
  initial state Open { 
    in 1 hour[always] do { 
      project.leader.notify("[YouTrack, Approvement]", "Issue " + getId() + " hasn't been approved within 1 hour."); 
    } 
      
    on approve[always] do {<define statements>} transit to Approved 
  } 
    
  state Approved { 
    in 1 day[always] do { 
      project.leader.notify("[YouTrack, Reproduction]", "Issue " + getId() + " hasn't been reproduced within a day."); 
      project.leader.watchIssue(issue); 
       
      {group: sales}.notifyAllUsers("[YouTrack, Reproduced]", "Issue " + getId() + " hasn't been reproduced within a day."); 
    } 
      
    on reproduce[always] do {<define statements>} transit to Reproduced 
  } 
    
  state Reproduced { 
    in 3 days[always] do { 
      {group: sales}.notifyAllUsers("[YouTrack, Visit on-site]", "Issue " + getId() + " needs your attention.."); 
       
    } 
      
    on visit[always] do {<define statements>} transit to Visit on-site 
      
    on close[always] do {<define statements>} transit to Closed 
  } 
    
  state Visit on-site { 
    on close[always] do {<define statements>} transit to Closed 
  } 
    
  state Closed { 
    on reopen[always] do {<define statements>} transit to Open 
  } 
 
}
