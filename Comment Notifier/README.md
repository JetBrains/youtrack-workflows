Comment Notifier
====================

Notifies all users mentioned in a comment using the @{User.name} syntax

```java
rule Notify All Mentioned Users In Comments 
 
when comments.added.last.text.contains("@", ignoreCase) { 
  var mentionedUsers = comments.last.text.split("@", opts); 
  for each mentionedUser in mentionedUsers { 
    var mentionedUserEndIndex = mentionedUser.indexOf(" ", opts); 
    var mentionedUserName = mentionedUser.substring(0, mentionedUserEndIndex); 
    for each user in {group: All Users}.getUsers() { 
      if (user.login == mentionedUserName) { 
        user.notify("You were mentioned in a comment on " + issue.project.name, "Your name was mentioned in comment " + getId() + "<br/><br/>\"" + comments.last.text + "\" - " + comments.last.author.fullName); 
      } 
    } 
  } 
}
```
