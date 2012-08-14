Time Management 
====================

    Change issue state in time automatically.
    Notify an issue assignee, project lead or subsystem owner when issue life-cycle is violated.
    
>Requirements:
>        subsystem 'Support'
>        state 'Overdue'
>        state 'Wait for reproduce'
>        state 'Approved'

Time Management for State field
```java
statemachine Time Management for field State {

  initial state Submitted {
    enter {
      Subsystem = {Support};
      Assignee.required("Responsible support engineer is required!");
    }

    in 1 hour[always] do {<define statements>} transit to Overdue

    on reproducing[always] do {<define statements>} transit to Open

    on incomplete[always] do {<define statements>} transit to Incomplete
  }

  state Overdue {
    enter {
      var user;

      if (Assignee != null) {
        user = Assignee;
      } else if (Subsystem.owner != null) {
        user = Subsystem.owner;
      } else {
        user = project.leader;
      }
      user.notify("Acknowledgement needed", "Issue" + getId() + "is waiting for acknowledgement.");
    }

    on incomplete[always] do {<define statements>} transit to Incomplete

    on reproducing[always] do {<define statements>} transit to Open
  }

  state Open {
    in 4 hours[always] do {<define statements>} transit to Wait for reproduce

    on approved[always] do {<define statements>} transit to Approved

    on incomplete[always] do {<define statements>} transit to Incomplete

    on can't reproduce[always] do {<define statements>} transit to Can't Reproduce
  }

  state Wait for reproduce {
    in 1 day[always] do {
      var user;

      if (Subsystem.owner != null) {
        user = Subsystem.owner;
      } else {
        user = project.leader;
      }
      user.notify("Issue is not reproduced in 1 day",
 "Issue " + getId() + " is still waiting for reproduction steps.");
      // Notify sales?
    }

    in 3 days[always] do {
      var user;

      if (Subsystem.owner != null) {
        user = Subsystem.owner;
      } else {
        user = project.leader;
      }
      user.notify("Issue is not reproduced in 4 days", "Issue " + getId() +
" is not reproduced. You may want to visit the customer at their site.");
      // Notify sales?
    }

    on approved[always] do {<define statements>} transit to Approved

    on can't reproduce[always] do {<define statements>} transit to Can't Reproduce

    on incomplete[always] do {<define statements>} transit to Incomplete
  }

  state Can't Reproduce {
    on reopen[always] do {<define statements>} transit to Open
  }

  state Incomplete {
    on reopen[always] do {<define statements>} transit to Open
  }

  state Approved {
    enter {
      Assignee.required(fail message);
    }

    on fixed[always] do {<define statements>} transit to Fixed

    on obsolete[always] do {<define statements>} transit to Obsolete
  }

  state Fixed {
    on verify[always] do {<define statements>} transit to Verified

    on reopen[always] do {<define statements>} transit to Open
  }

  state Obsolete {
    on reopen[always] do {<define statements>} transit to Open
  }

  state Verified {
    on reopen[always] do {<define statements>} transit to Open
  }

}
```
