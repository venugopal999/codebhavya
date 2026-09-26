(function () {
  'use strict';
  const courses = window.CodeBhavyaOfflineCourses;
  const list = document.getElementById('courseList');
  const search = document.getElementById('courseSearch');
  const noResults = document.getElementById('noCourseResults');
  if (!courses || !list) return;
  list.textContent = '';

  for (const course of Object.values(courses)) {
    const card = document.createElement('section');
    card.className = 'card';
    card.dataset.courseTitle = course.title.toLocaleLowerCase();
    const heading = document.createElement('h2');
    heading.id = `offline-${course.id}`;
    heading.textContent = course.title;
    card.setAttribute('aria-labelledby', heading.id);
    const label = document.createElement('span');
    label.className = 'eyebrow';
    label.textContent = 'Public course';
    const detail = document.createElement('p');
    detail.textContent = `${course.lessonCount} lessons · Optional download`;
    const message = document.createElement('p');
    message.className = 'status';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    message.textContent = 'Checking saved lessons…';
    const actions = document.createElement('div');
    actions.className = 'actions';
    const open = document.createElement('a');
    open.className = 'action open';
    open.href = course.url;
    open.textContent = 'Open course';
    open.hidden = true;
    const save = document.createElement('button');
    save.className = 'primary';
    save.type = 'button';
    save.textContent = 'Save for offline';
    save.disabled = true;
    const remove = document.createElement('button');
    remove.className = 'remove';
    remove.type = 'button';
    remove.textContent = 'Remove download';
    remove.hidden = true;
    actions.append(open, save, remove);
    card.append(label, heading, detail, message, actions);
    list.append(card);

    async function render() {
      if (!('caches' in window) || !('serviceWorker' in navigator)) {
        message.textContent = 'Offline saving is unavailable in this browser.';
        save.disabled = true;
        return;
      }
      const state = await course.status();
      message.textContent = state.complete
        ? `${course.lessonCount} lessons ready to read offline on this device.`
        : state.downloaded ? 'Download incomplete. Connect and finish saving this course.'
          : 'Not saved on this device.';
      save.textContent = state.complete ? 'Refresh download' : state.downloaded ? 'Finish download' : 'Save for offline';
      save.disabled = false;
      open.hidden = !state.complete;
      remove.hidden = !state.downloaded;
    }

    save.addEventListener('click', async function () {
      save.disabled = true;
      remove.disabled = true;
      message.textContent = 'Saving lessons… stay online until complete.';
      try {
        await course.save((done, total) => {
          message.textContent = `Saving lessons… ${done} of ${total} files.`;
        });
        await render();
      } catch (error) {
        try {
          await render();
          message.textContent += ' Check your connection and retry.';
        } catch (ignored) {
          message.textContent = 'Could not finish downloading. Please try again.';
          save.disabled = false;
        }
      } finally {
        remove.disabled = false;
      }
    });

    remove.addEventListener('click', async function () {
      remove.disabled = true;
      save.disabled = true;
      try {
        await course.remove();
        await render();
      } catch (error) {
        message.textContent = 'Could not remove this download. Please try again.';
        save.disabled = false;
      } finally {
        remove.disabled = false;
      }
    });

    render().catch(() => {
      message.textContent = 'Could not read saved lessons on this device.';
      save.disabled = true;
    });
  }
  if (search && noResults) {
    search.addEventListener('input', function () {
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      for (const card of list.children) {
        card.hidden = !card.dataset.courseTitle.includes(query);
        if (!card.hidden) visible++;
      }
      noResults.hidden = visible !== 0;
    });
  }
})();
