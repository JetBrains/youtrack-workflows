Advanced States Machine 
====================
Manage states transitions.

>Requirements:
>    field 'Verified by' user of type 'user'
>    field 'Verified in build' of type 'build'
>    value 'W/O verification in bundle 'State'
>    state 'Wait for Reply'

Lifecycle of the State field
```java
statemachine States for field State {

  initial state Submitted {
    in 3 days[State == {Submitted}] do {
      var user = Assignee;

      if (user == null) {
        user = project.leader;
      }

      user.notify("[Youtrack, State reminder] Issue " + issue.getId()
      + " is still Submitted: " + issue.summary, "Hi, " + user.fullName
      + "! <br><br> Issue <a href="" + issue.getUrl() + "">" + issue.getId()
      + "</a>" + " is still in Submitted state:" + " <a href="" + issue.getUrl()
      + "">" + issue.summary + "</a>"
      + "<br> Please start working on it or specify a more accurate state.<br><br>"
      + "<p style="color: gray;font-size: 12px;margin-top: 1em;border-top: 1px solid #D4D5D6">"
      + "Sincerely yours, YouTrack" + "</p>");
    }

    on fix[always] do {<define statements>} transit to Fixed

    on open[always] do {<define statements>} transit to Open

    on in progress[always] do {<define statements>} transit to In Progress

    on discuss[always] do {<define statements>} transit to To be discussed

    on can't reproduce[always] do {<define statements>} transit to Can't Reproduce

    on obsolete[always] do {<define statements>} transit to Obsolete

    on duplicate[always] do {<define statements>} transit to Duplicate

    on as designed[always] do {<define statements>} transit to As designed

    on invalidate[always] do {<define statements>} transit to Invalid
  }

  state Open {
    on in progress[always] do {<define statements>} transit to In Progress

    on discuss[always] do {<define statements>} transit to To be discussed

    on fix[always] do {<define statements>} transit to Fixed

    on obsolete[always] do {<define statements>} transit to Obsolete

    on duplicate[always] do {<define statements>} transit to Duplicate

    on can't reproduce[always] do {<define statements>} transit to Can't Reproduce

    on as designed[always] do {<define statements>} transit to As designed

    on invalid[always] do {<define statements>} transit to Invalid

    on wait[always] do {<define statements>} transit to Wait for Reply
  }

  state Reopened {
    on open[always] do {<define statements>} transit to Open
  }

  state Obsolete {
    on reopen[always] do {<define statements>} transit to Open
  }

  state Duplicate {
    on reopen[always] do {<define statements>} transit to Open
  }

  state In Progress {
    on reopen[always] do {<define statements>} transit to Open

    on fix[always] do {<define statements>} transit to Fixed

    on can't reproduce[always] do {<define statements>} transit to Can't Reproduce

    on obsolete[always] do {<define statements>} transit to Obsolete

    on as designed[always] do {<define statements>} transit to As designed
  }

  state To be discussed {
    on in progress[always] do {<define statements>} transit to In Progress

    on duplicate[always] do {<define statements>} transit to Duplicate

    on obsolete[always] do {<define statements>} transit to Obsolete
  }

  state Can't Reproduce {
    on reopen[always] do {<define statements>} transit to Open
  }

  state As designed {
    on reopen[always] do {<define statements>} transit to Open
  }

  state Won't fix {
    on reopen[always] do {<define statements>} transit to Open
  }

  state Invalid {
    on reopen[always] do {<define statements>} transit to Open
  }

  state Incomplete {
    on reopen[always] do {<define statements>} transit to Open
  }

  state Fixed {
    on reopen[always] do {<define statements>} transit to Open

    on verify[always] do {<define statements>} transit to Verified

    on can't verify[always] do {<define statements>} transit to W/O verification
  }

  state W/O verification {
    enter {
      Verified by = loggedInUser;
    }

    on reopen[always] do {<define statements>} transit to Open
  }

  state Verified {
    on reopen[always] do {<define statements>} transit to Open

    enter {
      Verified in build.required("Specify verified in build");
      Verified by = loggedInUser;
    }

    exit {
      Verified in build = null;
    }
  }

  state Wait for Reply {
    on fix[always] do {<define statements>} transit to Fixed

    on open[always] do {<define statements>} transit to Open

    on in progress[always] do {<define statements>} transit to In Progress

    on discuss[always] do {<define statements>} transit to To be discussed

    on can't reproduce[always] do {<define statements>} transit to Can't Reproduce

    on obsolete[always] do {<define statements>} transit to Obsolete

    on duplicate[always] do {<define statements>} transit to Duplicate

    on as designed[always] do {<define statements>} transit to As designed

    on invalidate[always] do {<define statements>} transit to Invalid
  }

}
```
